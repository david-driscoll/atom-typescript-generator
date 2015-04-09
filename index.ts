require('coffee-script/register');
var donna = require('donna');
var atomdoc = require('atomdoc');
import * as fs from 'fs'
import {join} from 'path'
import * as _ from 'lodash';
import {execSync} from "child_process";
var projectsToDocument = require('./projects.json').projects;

_.each(projectsToDocument, project => {
    if (fs.existsSync(`../${project}`)) {
        // pull?
        /*console.log(`Pulling ${project}...`)
        execSync(`git pull`,  {
            cwd: join(process.cwd(), `../${project}`),
            stdio: 'inherit'
        });*/
    } else {
        // clone
        execSync(`git clone git@github.com:atom/${project}.git`, {
            cwd: join(process.cwd(), "../"),
            stdio: 'inherit'
        });
    }
});

var metadata = _.map(projectsToDocument, project => ({ project, metadata: donna.generateMetadata(['../' + project]) }));

// config
//var ignorePrefix = ['Atom'];
var ignoreProperties = {
    "Atom": ["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"]
}

/*var instanceProperties = {
    "Atom": ['commands','config','clipboard','contextMenu','menu','keymaps','tooltips','notifications','project','grammars','packages','themes','styles','deserializers','views','workspace']
}
var staticProperties = {
    "Atom": ['commands','config','clipboard','contextMenu','menu','keymaps','tooltips','notifications','project','grammars','packages','themes','styles','deserializers','views','workspace']
}*/

var inference = {
    "AtomApplication": {
        windows: 'AtomWindow[]',
        //applicationMenu: 'ApplicationMenu',
    }
}

var definedClasses = [];

var modulesToDocument = [];

interface ICommon {
    name: string;
    type: string;
    bindingType: string;
    doc: IDoc;
}
interface IDoc {
    originalText: string;
    visibility: string;
    description: string;
    summary: string;
    type?: string;
    arguments?: IDocArgument[];
    returnValues?: IDocReturn[];
}
interface IDocArgument {
    name: string;
    description: string;
    type: string;
    isOptional: boolean;
    children?: IDocArgument[];
}
interface IDocReturn {
    type: string;
    description: string;
}
interface IClass extends ICommon {
    superClass?: string;
    properties: IProperty[];
    project: string;
}
interface IProperty extends ICommon {
    paramNames?: string[];
}
interface IImport {
    name: string;
    type: string;
    bindingType: string;
    path?: string;
    module?: string;
    project: string;
    fromProject: string;
}


var classes: IClass[] = [];
var imports: IImport[] = [];
var types = [];
var knownClasses: string[] = definedClasses.concat();


_.each(metadata, (item) => {
    var metadata = item.metadata;
    var project = item.project;

    _.each(metadata, (x: any, metaKey: string) => {
        _.each(x.files, (fileMetadata, file) => {
            console.log(file);

            var fileContent = fs.readFileSync(`../${item.project}/${file}`).toString('utf-8').split('\n');

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
                      classes.push(_.extend({}, v));
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

                    classes = classes.concat(<any>_(c).chain().filter((x: any) => x.type === "class").map(z => {
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

console.log(types);


function getType(cls: IClass, property: IProperty, type: string, project: string) {
    if (type === "function")
        return type;

    if (property.doc && property.doc.type)
        return getMappedType(project, property.doc.type);

    if (property.doc && property.doc.originalText) {
        var text = property.doc.originalText;
        if (text.indexOf('{') > -1 && text.indexOf('}') > -1) {
            text = text.substr(text.indexOf('{') + 1, text.indexOf('}') - text.indexOf('{') - 1);
            return getMappedType(project, text);
        }
    }

    if (type === "primitive") {
        if (property.name) {
            var found = _.find(classes, x => x.name.toLowerCase() == property.name.toLowerCase());
            if (found)
                return getMappedType(project, found.name);
        }

        var inf = inference[cls.name];
        if (inf && inf[property.name])
            return inf[property.name];
        return 'any /* inferme */'
    }

    if (_.startsWith(type, ':'))
        return 'any'
    return type;
}

function getReturnType(argument: any, project: string) {
    if (argument.type === "Function")
        return 'any';
    if (argument.type === "Array")
        return 'any[]'
    if (argument.type === "Boolean" || argument.type === "String" || argument.type === "Number") {
        return `${argument.type.toLowerCase() }[]`
    }
    return getMappedType(project, argument.type) || 'any';
}

function getArgumentNamesWithTypes(argument: IDocArgument, project: string, docs: string[]) {
    if (!argument.children || argument.children.length === 0)
        return [];
    return _.map(argument.children, z => z.name + (z.isOptional && '?' || '') + ': ' + (getDocArgumentType(z, docs, project, argument.name)))
}

function extractArrayType(object: any, project: string) {
    var arrayTypeIndex = object.description.indexOf('{Array} of {');
    if (arrayTypeIndex > -1) {
        var arrayType = object.description.substr(arrayTypeIndex + '{Array} of {'.length);
        arrayType = arrayType.substr(0, arrayType.indexOf('}'));
    }

    arrayTypeIndex = object.description.indexOf('{Array} of `');
    if (!arrayType && arrayTypeIndex > -1) {
        var arrayType = object.description.substr(arrayTypeIndex + '{Array} of {'.length);
        arrayType = arrayType.substr(0, arrayType.indexOf('`'));
    }

    if (arrayType) {
        if (arrayType === "Boolean" || arrayType === "String" || arrayType === "Number") {
            return `${arrayType.toLowerCase() }[]`
        }
        return `${getMappedType(project, arrayType) }[]`;
    }

    return 'any[]'
}

function getDocArgumentType(argument: IDocArgument, docs: string[], project: string, prefix: string = '') {
    if (prefix) prefix += '.';
    var name = prefix + argument.name;
    if (argument.isOptional)
        name = `[${name}]`;
    docs.push(`     * @param ${name} - ${argument.description}`);

    var type: string = 'any';
    if (argument.type === "Object" && argument.children && argument.children.length) {
        type = `{ ${getArgumentNamesWithTypes(argument, project, docs).join('; ') } }`;
    } else if (argument.type === "Function") {
        var returnType = getReturnType(argument, project);
        if (argument.children && argument.children.length) {
            type = `(${getArgumentNamesWithTypes(argument, project, docs).join(', ') }) => ${returnType}`
        } else {
            type = `() => ${returnType}`
        }
    } else if (argument.type == 'Array') {
        return extractArrayType(argument, project);
    } else if (argument.type === "Boolean" || argument.type === "String" || argument.type === "Number") {
        type = argument.type.toLowerCase();
    } else if (argument.type) {
        type = getMappedType(project, argument.type);
    }

    return type;
}

function getParam(cls: IClass, property: IProperty, paramName: string, index: number, docs?: string[]) {
    if (property.doc && property.doc.arguments) {
        var argument = _.find(property.doc.arguments, z => z.name == paramName);
        if (argument) {
            docs = docs || [];
            var result = `${argument.name}: ${getDocArgumentType(argument, docs, cls.project) }`

            return { result, doc: docs.join('\n') || '' };
        }
    }

    return { result: paramName + ': any', doc: '' };
}

function getReturnValue(returnValues: IDocReturn[], project: string, docs: string[]) {
    var values = _.map(returnValues, returnValue => {
        docs.push(`${returnValue.type || 'any'} - ${returnValue.description}`)
        if (returnValue.type === null)
            return 'any';

        if (returnValue.type === "Function") {
            var returnType = getReturnType(returnValue, project);
            return `() => ${returnType}`
        } else if (returnValue.type == 'Array') {
            return extractArrayType(returnValue, project);
        } else if (returnValue.type === "Boolean" || returnValue.type === "String" || returnValue.type === "Number") {
            return returnValue.type.toLowerCase();
        } else if (returnValue.type) {
            return getMappedType(project, returnValue.type);
        }
    });

    if (!values.length) {
        return 'any';
    }

    if (values.indexOf('any') > -1) {
        return 'any';
    }

    return values.join(' | ');
}

function getProperty(cls: IClass, property: IProperty) {
    // There are some methods that are private that are useful elsewhere...
    //if (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section"))
    //    return;

    if (ignoreProperties[cls.name] && ignoreProperties[cls.name].indexOf(property.name) > -1)
        return;

    var type = getType(cls, property, property.type, cls.project);

    var prefix = '';
    //if (property.bindingType === "prototypeProperty" && ignorePrefix.indexOf(cls.name) === -1)
    //    prefix = 'static '

    var paramDocs = [];
    var propertyType = `: ${type}`;
    if (type === 'function') {



        if (property.name === "constructor") {
            var constr: any = property;

            function consolidateParams(params: any[]) {
                return _.map(params, (param, index) => {
                    var n = param.name;
                    if (param.name.match(/^\d/)) {
                        n = ('unknown' + index);
                    }

                    var res = `${param.name}: `;

                    if (param.children && param.children.length) {
                        res += `{ ${consolidateParams(param.children).join('; ') } }`
                    } else if (param.children) {
                        res += 'Object';
                    } else {
                        var fakeProperty: IProperty = {
                            paramNames: null,
                            name: param.name,
                            type: "primitive",
                            bindingType: "",
                            doc: null
                        }

                        var t = getType(cls, fakeProperty, fakeProperty.type, cls.project);
                        if (_.startsWith(t, getProjectName(cls.project)) + '.') {
                            t = t.substr(t.indexOf('.')+1);
                        }

                        if (t.indexOf('/') > -1)
                            t = 'any'

                        res += t;
                    }

                    return res;
                });
            }

            var res: string;
            var params = consolidateParams(constr.constructorParams);
            console.log(params)
            if (constr.constructorDesctructured) {
                res = `{ ${params.join(', ') } }`;
            } else {
                res = params.join(', ')
            }

            var signature = res;
            propertyType = `(${signature})`;
        } else {

            var signature = _.map(property.paramNames, (x, i) => {
                var paramName = (x || ('unknown' + i));
                var param = getParam(cls, property, (x || ('unknown' + i) /* takes a param but we don't know what */), i);
                paramDocs.push(param.doc)
                return param.result;
            }).join(', ');

            var returnValue = 'any';
            var returnDocs = [];
            if (property.doc && property.doc.returnValues && property.doc.returnValues.length) {
                returnValue = getReturnValue(property.doc.returnValues, cls.project, returnDocs);
            }
            propertyType = `(${signature}): ${returnValue}`;
        }

    }

    var result = `    ${prefix}${property.name}${propertyType};`
    if (property.doc) {
        var doc = `     * ${property.doc.description.replace(/\n/g, '\n     * ') }`;
        if (paramDocs.length)
            doc += `\n     * \n${paramDocs.join('') }`
    }

    if (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section")) {
        doc += '\n     * *** This property or method was marked private by atomdoc. Use with caution. ***';
    }

    if (returnDocs && returnDocs.length) {
        doc += '\n     * @returns ' + returnDocs.join('\n     * @returns ')
    }

    return { result, doc: doc || '' };
}

function getClass(cls: IClass) {
    var properties = [];

    var cb = property => {
        var p = getProperty(cls, property);
        if (p) {
            if (p.doc) {
                properties.push(`    /**\n${p.doc}\n     */`);
            }
            properties.push(`${p.result}\n`);
        }
    };

    _.each(cls.properties, cb);

    var doc = '';
    if (cls.doc) {
        doc = ` * ${cls.doc.summary}\n` + doc;
    }
    if (doc) {
        doc = `/**${doc}\n */`;
    }

    var superType = getSuperType(cls.project, cls.name, cls.superClass);
    var superClass = superType && ' extends ' + superType || '';
    //if (knownClasses.indexOf(superClass) === -1)
    //superClass = `/* ${superClass} */`

    var result = `${doc}\ninterface ${cls.name}${superClass} {\n${properties.join('\n') }\n}`

    //console.log(result)
    return result;
}

var getFileName = (name: string) => `_${name}.atomdoc.d.ts`.toLowerCase();
var allFileNames = _.unique(_.map(classes, x => getFileName(x.name)));

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
    var constr = _.find(properties, x => x.name === "constructor"); properties
    if (constr) {
        var desctructured = desctructuredConstructor.exec(constr.code);
        var value: string;
        if (desctructured) {
            value = desctructured[1]//.split(',').map(z => z.trim());
        } else {

            var normal = normalConstructor.exec(constr.code);
            if (normal) {
                value = normal[1]//.split(',').map(z => z.trim());
            }
        }

        if (value) {

            var values = parseParam(value);

            console.log('desctructured', !!desctructured);
            console.log('normal', !!normal)

            constr.constructorParams = values;
            constr.constructorDesctructured = !!desctructured;

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

classes = <any> _.flatten(_.map(classes, splitClasses));
knownClasses = knownClasses.concat(_.unique(classes.map(z => z.name)));

var projectImports = _(imports)
    .chain()
    .map(z => ({ project: z.project, name: z.name, fromProject: z.fromProject }))
    .groupBy(z => z.project)
    .value();

var projectMap: { [key: string]: string[] } = {};
_.each(_.keys(projectImports), key => projectMap[key] = _(projectImports[key]).chain().map(z => z.fromProject).unique().difference([key]).filter(x => !!x).value())

var projectTypeMap: { [key: string]: { [key: string]: string } } = {};
_.each(_.keys(projectImports), key => {
    var dict = projectTypeMap[key] = {};
    _.each(projectImports[key], x => dict[x.name] = `${getProjectName(x.fromProject) }.${x.name}`);
});
//console.log(projectTypeMap)

function getProjectName(project: string) {
    if (_.startsWith(project, "node-")) {
        project = project.replace("node-", "");
    }

    if (project === "semver") {
        return "SemVerModule";
    }
    return _.capitalize(_.camelCase(project));
}

function getMappedType(project: string, value: string) {
    if (_.startsWith(project, "node-")) {
        var newName = project.replace('node-', '')
        if (projectTypeMap[newName] && projectTypeMap[newName][value]) {
            return projectTypeMap[newName][value];
        }
    }

    if (value === "Grammar") {
        return "FirstMate.Grammar";
    }

    if (value === "semver") {
        return "SemVerModule.SemVer";
    }

    if (value === "jQuery") {
        return "JQuery";
    }

    if (value === "Promise") {
        return "Q.Promise<any>";
    }

    if (value === "Bool") {
        return "boolean";
    }

    if (value === "array") {
        return "any[]";
    }

    if (project === "atom" && value === "View") {
        return "SpacePen.View";
    }

    if (value === "Mixto") return '';
    if (value === "Mixin") return '';
    if (value === "Disposable") return 'EventKit.Disposable';

    var result = projectTypeMap[project][value];
    if (result === '.EventEmitter') {
        result = 'NodeJS.EventEmitter'
    }

    if (_.startsWith(value, ':') || _.startsWith(value, '/'))
        return 'any'

    return result || value;
}

function getSuperType(project: string, className: string, superName: string) {
    return projectTypeMap[_.kebabCase(superName)] && projectTypeMap[_.kebabCase(superName)][className] || getMappedType(project, superName);
}

var results = _.map(classes, (cls: IClass) => {
    var content = getClass(cls);
    // Handle duplicate variable in one place
    content = content.replace('deferredChangeEvents', '//deferredChangeEvents')

    if (cls.name === 'TextEditorView' && cls.project === 'atom')
        content = content
            .replace('scrollLeft', '//scrollLeft')
            .replace('scrollTop', '//scrollTop')
            .replace('remove', '//remove')
    return { content, project: cls.project };
});


_.each(_.groupBy(results, x => x.project), (contents, project) => {
    var results = _.map(contents, x => x.content);
    var projectName = getProjectName(project);
    var references = _.difference(projectsToDocument, [project])
        .map(x => `/// <reference path="../${x}/${x}.d.ts" />`).join('\n');

    var content = `${references}

declare module ${projectName} {
${results.join('\n\n') }
}\n\n`

    if (fs.existsSync(`./helpers/${project}.d.ts`)) {
        content += fs.readFileSync(`./helpers/${project}.d.ts`).toString('utf-8');
    }

    if (!fs.existsSync(`./typings/${project}`))
        fs.mkdir(`./typings/${project}`);
    fs.writeFileSync("./metadata.json", JSON.stringify({ classes: classes, imports: imports }, null, 4))
    fs.writeFileSync(`./typings/${project}/${project}.d.ts`, content);

});
    //throw 'abcd';
