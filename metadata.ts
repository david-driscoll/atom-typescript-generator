import {readFileSync, writeFileSync, existsSync} from 'fs'
var projectsToDocument = require('./projects.json').projects;
var donna = require('donna');
var atomdoc = require('atomdoc');
import * as _ from 'lodash'
import ProjectConverted from "./converter/Project";

export var classes: IClass[] = [];
export var imports: IImport[] = [];

var loaded = false;
var types = [];
if (existsSync('./metadata.json')) {
    var m = JSON.parse(readFileSync('./metadata.json').toString('utf-8'));
    classes = m.classes;
    imports = m.imports;
} else {
    load();
}

export var projectImports : _.Dictionary<{ project:string;name: string; fromProject: string; }[]> = _(imports)
    .chain()
    .map(z => ({ project: z.project, name: z.name, fromProject: z.fromProject }))
    .groupBy(z => z.project)
    .value();

export var projectMap: { [key: string]: string[] } = {};
export var projectTypeMap: { [key: string]: { [key: string]: string } } = {};
export var knownClasses: string[] = [];

_.each(_.keys(projectImports), key => projectMap[key] = _(projectImports[key]).chain().map(z => z.fromProject).unique().difference([key]).filter(x => !!x).value());
_.each(_.keys(projectImports), key => {
    var dict = projectTypeMap[key] = {};
    _.each(projectImports[key], x => dict[x.name] = `${ProjectConverted.getProjectDisplayName(x.fromProject) }.${x.name}`);
});
knownClasses.push(... _.unique(classes.map(z => z.name)))

function load() {
    loaded = true;
    var metadata = _.map(projectsToDocument, project => ({ project, metadata: donna.generateMetadata(['../' + project]) }));
    var classesTemp: IClass[] = [];

    _.each(metadata, (item) => {
        var metadata = item.metadata;
        var project = item.project;

        _.each(metadata, (x: any, metaKey: string) => {
            _.each(x.files, (fileMetadata, file) => {

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

                        return lines.join('\n');
                    }
                }

                _.each(fileMetadata, (z, type) => {
                    console.log(type);

                    _.each(z, (c, ck) => {

                        types = _.unique(types.concat(_(c)
                            .chain()
                            .map((z: any) => z.type)
                            .value()));

                        imports.push(... <any[]>_(c).chain().filter((x: any) => x.type === 'import').map(z => {
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

                        classesTemp.push(... <any[]>_(c).chain().filter((x: any) => x.type === "class").map(z => {
                            var value: any = _.extend({}, z);
                            value.code = getCode(value);

                            value.project = project;

                            if (value.doc) {
                                value.doc = atomdoc.parse(value.doc)
                            }

                            var objs: any = (<any>fileMetadata).objects;

                            value.classProperties = _.map(value.classProperties, (x: number[]) => {
                                var copy: any = _.extend({}, objs[x[0]][x[1]]);
                                copy.code = getCode(copy);
                                delete copy.range;
                                if (copy.doc) {
                                    copy.doc = atomdoc.parse(copy.doc)
                                }
                                return copy;
                            });
                            value.prototypeProperties = _.map(value.prototypeProperties, (x: number[]) => {
                                var copy: any = _.extend({}, objs[x[0]][x[1]]);
                                copy.code = getCode(copy);
                                delete copy.range;
                                if (copy.doc) {
                                    copy.doc = atomdoc.parse(copy.doc)
                                }
                                return copy;
                            });

                            delete value.range;

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

        value = value.trim();
        while (value) {
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


    function resolveConstructors(properties: any[], constructorProtoProperties?: any[]): any[] {
        var functions = _.filter(properties, x => x.type === "function" || x.name === "new");
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

                    func.params = values;
                    func.destructured = !!desctructured;

                    if (func.name === "constructor" || func.name === "new") {
                        var processValues = (value) => {
                            if (value.children) {
                                _.each(value.children.reverse(), processValues)
                                value.children.reverse()
                            }

                            if (value.isProperty) {
                                var v: any = _.extend({}, value);
                                delete v.isProperty;
                                delete v.isOptional;
                                if (func.name === "new" && !_.any(constructorProtoProperties, z => z.name == v.name)) {
                                    constructorProtoProperties.unshift(v);
                                } else if (!_.any(properties, z => z.name == v.name)) {
                                    properties.unshift(v);
                                }
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

        var hasStatic = !!(cls.classProperties && cls.classProperties.length);
        var hasInstance = !!(cls.prototypeProperties && cls.prototypeProperties.length);
        var instanceProperties = [];

        if (hasStatic) {
            var staticName = cls.name + 'Static';

            if (hasInstance) {
                var constr = _.find(cls.prototypeProperties, (x: any) => x.name === "constructor");
                if (constr) {
                    _.pull(cls.prototypeProperties, constr);
                    cls.prototypeProperties.unshift(<IProperty>{
                        name: 'constructor',
                        type: staticName,
                        bindingType: "primitive"
                    });
                    constr.name = 'new';
                    cls.classProperties.unshift(constr);
                }
            }

            var properties = resolveConstructors(cls.classProperties, hasInstance && instanceProperties);

            var r = <any>_.extend({}, cls, { name: staticName, properties: properties });
            if (r.superClass) r.superClass += 'Static'
            delete r.classProperties;
            delete r.prototypeProperties;
            result.push(r);
        }

        if (hasInstance) {

            var properties = instanceProperties.concat(resolveConstructors(cls.prototypeProperties));

            var r = <any>_.extend({}, cls, { properties: properties });
            delete r.classProperties;
            delete r.prototypeProperties;
            result.push(r);
        }

        return result;
    }

    _.each(_.flatten(_.map(classesTemp, splitClasses)), (x: IClass) => classes.push(x))

    writeFileSync("./metadata.json", JSON.stringify({ classes: classes, imports: imports }, null, 4))
}
