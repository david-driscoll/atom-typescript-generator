import {readFileSync} from 'fs'
var projectsToDocument = require('./projects.json').projects;
var donna = require('donna');
var atomdoc = require('atomdoc');
import * as _ from 'lodash'


var loaded = false;
var classes: IClass[] = [];
var imports: IImport[] = [];
var types = [];
export function getClasses() { if (!loaded) load(); return classes; }
export function getImports() { if (!loaded) load(); return imports; };
//export var types = [];

function load() {
    loaded = true;
    var metadata = _.map(projectsToDocument, project => ({ project, metadata: donna.generateMetadata(['../' + project]) }));
    var classesTemp: IClass[] = [];

    _.each(metadata, (item) => {
        var metadata = item.metadata;
        var project = item.project;

        _.each(metadata, (x: any, metaKey: string) => {
            _.each(x.files, (fileMetadata, file) => {
                console.log(file);

                var fileContent = readFileSync(`../${item.project}/${file}`).toString('utf-8').split('\n');

                function getCode(value) {
                    if (value.range) {
                        var startLine = value.range[0][0];
                        var startColumn = value.range[0][1];
                        var endLine = value.range[1][0];
                        var endColumn = value.range[0][1];

                        var lines = [];

                        lines.push(fileContent[startLine].substring(startColumn));
                        for (var i = startLine + 1; i < endLine; i++) {
                            lines.push(fileContent[i])
                        }
                        lines.push(fileContent[endLine].substr(0, endColumn));

                        //console.log()

                        return lines.join('\n');
                    }
                }

                _.each(fileMetadata, (z, type) => {
                    console.log(type);

                    //if (type === "exports")
                    //    console.log(z)

                    _.each(z, (c, ck) => {

                        /*_(c).filter(x => x.type != "import")
                          .each((v, k) => {
                          //console.log(ck, k, v)
                          classesTemp.push(_.extend({}, v));
                      }).value()*/
                        types = _.unique(types.concat(_(c)
                            .chain()
                            .map((z: any) => z.type)
                            .value()));

                        imports = imports.concat(<any>_(c).chain().filter((x: any) => x.type === 'import').map(z => {
                            var value: any = _.extend({}, z);
                            value.code = getCode(value);
                            delete value.range;

                            value.project = project;
                            value.fromProject = project;
                            if (value.module) {
                                value.fromProject = value.module.substr(0, value.module.indexOf('@'));
                            }
                            return value;
                        }).value());

                        classesTemp = classesTemp.concat(<any>_(c).chain().filter((x: any) => x.type === "class").map(z => {
                            var value: any = _.extend({}, z);
                            value.code = getCode(value);

                            value.project = project;

                            if (value.doc) {
                                value.doc = atomdoc.parse(value.doc)
                            }

                            var objs: any = (<any>fileMetadata).objects;

                            //console.log(value.classProperties)
                            //value.classProperties = _.map(value.classProperties, (x: number[]) => fileMetadata.objects[x[0]][x[1]]);
                            //value.prototypeProperties = _.map(value.prototypeProperties, (x: number[]) => fileMetadata.objects[x[0]][x[1]]);
                            value.classProperties = _.map(value.classProperties, (x: number[]) => {
                                //console.log(x, x[0], x[1]);
                                var copy: any = _.extend({}, objs[x[0]][x[1]]);
                                copy.code = getCode(copy);
                                delete copy.range;
                                if (copy.doc) {
                                    copy.doc = atomdoc.parse(copy.doc)
                                }
                                return copy;
                            });
                            value.prototypeProperties = _.map(value.prototypeProperties, (x: number[]) => {
                                //console.log(x, x[0], x[1]);
                                var copy: any = _.extend({}, objs[x[0]][x[1]]);
                                copy.code = getCode(copy);
                                delete copy.range;
                                if (copy.doc) {
                                    copy.doc = atomdoc.parse(copy.doc)
                                }
                                return copy;
                            });

                            delete value.range;

                            //console.log(value.classProperties);

                            return value;
                        }).value())
                    })
                })

                //return false;
            })
        })
    })


    var desctructuredConstructor = /^\(\{(.*?)\}\)/;
    var normalConstructor = /^\((.*?)\)/;

    function parseParam(value: string) {
        var makeParam = (name: string, isOptional: boolean, children?: any[]) => ({
            "name": _.trim(name.replace("@", ""), '}'),
            "bindingType": "prototypeProperty",
            "type": "primitive",
            "isProperty": _.startsWith(name, "@"),
            "isOptional": isOptional,
            "children": children
        });

        var result: any[] = [];

        console.log(value);
        value = value.trim();
        while (value) {
            console.log(value);
            var comma = value.indexOf(',');

            var name = '', optional = false, children: any[] = null;
            if (value[0] === '{') {
                var brace = value.indexOf('}');
                var v = value.substr(1, brace);
                var children = parseParam(v);

                name = "options"
                value = value.substr(brace + 1).trim();

                if (value[0] === '=')
                    optional = true;
            } else {
                var v = comma > -1 ? value.substr(0, comma) : _.trim(value, '}');
                var equals = v.indexOf('=');
                name = v;
                optional = equals > -1;
                if (optional)
                    name = name.substr(0, equals)
            }
            var param = makeParam(name, optional, children);
            result.push(param);

            if (comma == -1) {
                break;
            }

            value = value.substr(comma + 1).trim();
        }

        return result;
    }


    function resolveConstruors(properties: any[]): any[] {
        var functions = _.filter(properties, x => x.type === "function");
        if (functions.length) {
            _.each(functions, func => {
                var desctructured = desctructuredConstructor.exec(func.code);
                var value: string;
                if (desctructured) {
                    value = desctructured[1]//.split(',').map(z => z.trim());
                } else {

                    var normal = normalConstructor.exec(func.code);
                    if (normal) {
                        value = normal[1]//.split(',').map(z => z.trim());
                    }
                }

                if (value) {
                    var values = parseParam(value);

                    console.log('desctructured', !!desctructured);
                    console.log('normal', !!normal)

                    func.params = values;
                    func.destructured = !!desctructured;

                    if (func.name === "constructor") {
                        var processValues = (value) => {
                            if (value.children) {
                                _.each(value.children.reverse(), processValues)
                                value.children.reverse()
                            }

                            if (value.isProperty) {
                                var v: any = _.extend({}, value);
                                delete v.isProperty;
                                delete v.isOptional;
                                if (!_.any(properties, z => z.name == v.name))
                                    properties.unshift(v);
                            }
                        }

                        _.each(values.reverse(), processValues)
                        values.reverse()
                    }
                }
            })
        }

        return properties;
    }

    function splitClasses(cls: any): IClass[] {
        var result: IClass[] = [];

        if (cls.classProperties.length) {

            var properties = resolveConstruors(cls.classProperties);

            var r = <any>_.extend({}, cls, { name: cls.name + 'Static', properties: properties });
            delete r.superClass;
            delete r.classProperties;
            delete r.prototypeProperties;
            result.push(r);
        }

        if (cls.prototypeProperties) {

            var properties = resolveConstruors(cls.prototypeProperties);

            var r = <any>_.extend({}, cls, { properties: properties });
            delete r.classProperties;
            delete r.prototypeProperties;
            result.push(r);
        }

        return result;
    }

    _.each(_.flatten(_.map(classesTemp, splitClasses)), (x: IClass) => classes.push(x))
}
