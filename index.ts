require('coffee-script/register');
import * as fs from 'fs'
import * as _ from 'lodash';

import {projects, doNotTrack, references} from './updateProjects';
import inference from './inference';

var classes: IClass[] = [];
var imports: IImport[] = [];
import {getClasses, getImports} from './metadata';
if (fs.existsSync('./metadata.json')) {
    var m = JSON.parse(fs.readFileSync('./metadata.json').toString('utf-8'));
    classes = m.classes;
    imports = m.imports;
} else {
    classes = getClasses();
    imports = getImports();
}

function getType(cls: IClass, property: IProperty, paramName: string, type: string, project: string) {
    var t = inference.parameterTypes.handler({cls, property, name: paramName, index: _.indexOf(property.paramNames, paramName)});
    if (t) return t;

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

function getArgumentNamesWithTypes(cls: IClass, property: IProperty, argument: IDocArgument, project: string, docs: string[]) {
    if (!argument.children || argument.children.length === 0)
        return [];
    return _.map(argument.children, z => z.name + (z.isOptional && '?' || '') + ': ' + (getDocArgumentType(cls, property, z, docs, project, argument.name)))
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

function getDocArgumentType(cls: IClass, property: IProperty, argument: IDocArgument, docs: string[], project: string, prefix: string = '') {
    var param: { name: string, isOptional: boolean } = _.find(property.params, x => x.name === argument.name);
    var infer = inference.arguments.handler({cls, property, argument, param});

    if (prefix) prefix += '.';
    var name = prefix + argument.name;
    if (argument.isOptional || (param && param.isOptional))
        name = `[${name}]`;
    //else if ()
    docs.push(`     * @param ${name} - ${argument.description}`);

    var type: string = 'any';
    if (argument.type === "Object" && argument.children && argument.children.length) {
        type = `{ ${getArgumentNamesWithTypes(cls, property, argument, project, docs).join('; ') } }`;
    } else if (argument.type === "Function") {
        var returnType = getReturnType(argument, project);
        if (argument.children && argument.children.length) {
            type = `(${getArgumentNamesWithTypes(cls, property, argument, project, docs).join(', ') }) => ${returnType}`
        } else {
            type = 'Function';
        }
    } else if (argument.type == 'Array') {
        return extractArrayType(argument, project);
    } else if (argument.type === "Boolean" || argument.type === "String" || argument.type === "Number") {
        type = argument.type.toLowerCase();
    } else if (argument.type) {
        type = getMappedType(project, argument.type);
    }

    if (infer) return infer;
    return type;
}

function getParam(cls: IClass, property: IProperty, paramName: string, index: number, docs?: string[]) {
    if (property.doc && property.doc.arguments) {
        var argument = _.find(property.doc.arguments, z => z.name == paramName);
        if (argument) {
            docs = docs || [];
            var argName = inference.parameterNames.handler({cls, property, name: argument.name, index});

            console.log('argName:', argName, argument.name);
            var result = `${argName}: ${getDocArgumentType(cls, property, argument, docs, cls.project) }`

            return { result, doc: docs.join('\n') || '' };
        }
    }

    var t = inference.parameterTypes.handler({cls, property, name: paramName, index}) || 'any';
    paramName = inference.parameterNames.handler({cls, property, name: paramName, index});
    return { result: paramName + ': ' + t, doc: '' };
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

function getConsolidateParamsString(cls: IClass, property: IProperty) {
    var params = consolidateParams(cls, property, property.params);

    //console.log(params)
    if (property.destructured) {
        return `{ ${params.join(', ') } }`;
    } else {
        return params.join(', ')
    }
}

function consolidateParams(cls: IClass, property: IProperty, params: any[]) {
    return _.map(params, (param, index) => conslidateParam(cls, property, params, index));
}

function conslidateParam(cls: IClass, property: IProperty, param, index) {
    var n = param.name;
    if (!n || n.match(/^\d/)) {
        n = ('unknown' + index);
    }
    console.log({name: n, index, a: property.paramNames[index]})
    n = inference.parameterNames.handler({cls, property, name: n, index});
    var res = `${n}: `;

    if (param.children && param.children.length) {
        res += `{ ${consolidateParams(cls, property, param.children).join('; ') } }`
    } else if (param.children) {
        res += 'Object';
    } else {
        var fakeProperty: IProperty = <any>{
            paramNames: null,
            name: n,
            type: "primitive",
            bindingType: "",
            doc: null
        }

        var t = getType(cls, fakeProperty, fakeProperty.type, n, cls.project);
        if (_.startsWith(t, getProjectName(cls.project)) + '.') {
            t = t.substr(t.indexOf('.') + 1);
        }

        if (t.indexOf('/') > -1)
            t = 'any'

        res += t;
    }

    return res;
}

function getProperty(cls: IClass, property: IProperty) {
    // There are some methods that are private that are useful elsewhere...
    //if (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section"))
    //    return;
    if (inference.ignoreProperties.handler({cls, property}))
        return;


    var prefix = '';
    //if (property.bindingType === "prototypeProperty" && ignorePrefix.indexOf(cls.name) === -1)
    //    prefix = 'static '

    var paramDocs = [];
    if (property.type === 'function') {
        if (!property.doc) {

            var res = getConsolidateParamsString(cls, property);

            var signature = res;
        } else {

            var signature = _.map(property.paramNames, (x, i) => {
                var paramName = (x || (property.params[i] && property.params[i].name) || ('unknown' + i) /* takes a param but we don't know what */);
                var param = getParam(cls, property, paramName, i);
                paramDocs.push(param.doc)
                return param.result;
            }).join(', ');

        }

        var returnValue = 'any';
        var returnDocs = [];
        if (property.doc && property.doc.returnValues && property.doc.returnValues.length) {
            returnValue = getReturnValue(property.doc.returnValues, cls.project, returnDocs);
        }

        if (property.name === "constructor")
            propertyType = `(${signature})`;
        else
            propertyType = `(${signature}): ${returnValue}`;
    }
    if (!propertyType)
        var propertyType = `: any`;

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

    var result = `    ${doc}\ninterface ${cls.name}${superClass} {\n${properties.join('\n') }\n}`.split('\n').join('\n    ')

    //console.log(result)
    return result;
}

var getFileName = (name: string) => `_${name}.atomdoc.d.ts`.toLowerCase();
var allFileNames = _.unique(_.map(classes, x => getFileName(x.name)));

var knownClasses = _.unique(classes.map(z => z.name));

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

function getNodeName(project: string) {
    if (_.startsWith(project, "node-")) {
        project = project.replace("node-", "");
    }

    return project;
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

    if (value === "Repository")
        return "any"

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

    var projectReferences = _.intersection(projectMap[project], references)

    var notTracking = _.difference(projectMap[project], projects, doNotTrack, projectReferences).filter(z => !!z);
    if (notTracking.length)
        console.log(`${project} not tracking: ${notTracking}`);
    var refs = _.unique(_.intersection(projectMap[project], projects).concat(projectReferences).filter(z => !!z))
            .map(x => `/// <reference path="../${getNodeName(x) }/${getNodeName(x) }.d.ts" />`).join('\n');

    if (fs.existsSync(`./helpers/${getNodeName(project) }.d.ts`)) {
        var helper = fs.readFileSync(`./helpers/${getNodeName(project) }.d.ts`).toString('utf-8');

        var projectPackage = require(`../${project}/package.json`);
        helper = helper.replace("${version}", projectPackage.version).replace(/\$\{name\}/g, project);

        if (_.contains(helper, '//${refs}')) {
            helper = helper.replace('//${refs}', `${refs}
declare module ${projectName} {
${results.join('\n\n') }
}\n\n`);
            refs = ''

            var content = helper
        } else {
            refs += '\n'
        }
    }

   if (!content) {
    var content = `${refs}${helper || ''}
        are module ${projectName} {
            s.join('\n\n') }
}\n\n`
    }



    if (!fs.existsSync(`./typings/${getNodeName(project) }`))
        fs.mkdir(`./typings/${getNodeName(project) }`);
    fs.writeFileSync(`./typings/${getNodeName(project)}/${getNodeName(project) }.d.ts`, content);

});
    //throw 'abcd';
