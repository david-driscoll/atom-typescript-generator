require('coffee-script/register');
var donna = require('donna');
var atomdoc = require('atomdoc');
import * as fs from 'fs'
import * as _ from 'lodash';


var projectsToDocument = ['atom', 'event-kit', 'first-mate', 'atom-keymap', 'node-pathwatcher', 'text-buffer', 'atom-space-pen-views', 'space-pen', 'serializable'];
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
                        delete value.range;
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
                            delete copy.range;
                            if (copy.doc) {
                                copy.doc = atomdoc.parse(copy.doc)
                            }
                            return copy;
                        });
                        value.prototypeProperties = _.map(value.prototypeProperties, (x: number[]) => {
                            //console.log(x, x[0], x[1]);
                            var copy: any = _.extend({}, objs[x[0]][x[1]]);
                            delete copy.range;
                            if (copy.doc) {
                                copy.doc = atomdoc.parse(copy.doc)
                            }
                            return copy;
                        });

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
    return type;
}

function getReturnType(argument: any, project: string) {
    if (argument.type === "Function")
        return 'void';
    if (argument.type === "Array")
        return 'any[]'
    if (argument.type === "Boolean" || argument.type === "String" || argument.type === "Number") {
        return `${argument.type.toLowerCase() }[]`
    }
    return getMappedType(project, argument.type) || 'void';
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
        return 'void';
    }

    if (values.indexOf('any') > -1) {
        return 'any';
    }

    return values.join(' | ');
}

function getProperty(cls: IClass, property: IProperty) {
    if (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section"))
        return;

    if (ignoreProperties[cls.name] && ignoreProperties[cls.name].indexOf(property.name) > -1)
        return;

    var type = getType(cls, property, property.type, cls.project);

    var prefix = '';
    //if (property.bindingType === "prototypeProperty" && ignorePrefix.indexOf(cls.name) === -1)
    //    prefix = 'static '

    var paramDocs = [];
    var propertyType = `: ${type}`;
    if (type === 'function') {

        var signature = _.map(property.paramNames, (x, i) => {
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

    var result = `    ${prefix}${property.name}${propertyType};`
    if (property.doc) {
        var doc = `     * ${property.doc.description.replace(/\n/g, '\n     * ') }`;
        if (paramDocs.length)
            doc += `\n     * \n${paramDocs.join('') }`
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

function splitClasses(cls: any): IClass[] {
    var result: IClass[] = [];

    if (cls.classProperties.length) {
        var r = <any>_.extend({}, cls, { name: cls.name + 'Static', properties: cls.classProperties });
        delete r.superClass;
        delete r.classProperties;
        delete r.prototypeProperties;
        result.push(r);
    }

    if (cls.prototypeProperties) {
        var r = <any>_.extend({}, cls, { properties: cls.prototypeProperties });
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

var projectTypeMap: { [key: string]: {[key:string] : string } } = {};
_.each(_.keys(projectImports), key => {
    var dict = projectTypeMap[key] = {};
    _.each(projectImports[key], x => dict[x.name] = `${getProjectName(x.fromProject) }.${x.name}`);
});
console.log(projectTypeMap)

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

    return result || value;
}

function getSuperType(project: string, className:string, superName:string) {
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
}`

    if (!fs.existsSync(`./typings/${project}`))
        fs.mkdir(`./typings/${project}`);
    fs.writeFileSync("./metadata.json", JSON.stringify({ classes: classes, imports: imports }, null, 4))
    fs.writeFileSync(`./typings/${project}/${project}.d.ts`, content);

});
    //throw 'abcd';
