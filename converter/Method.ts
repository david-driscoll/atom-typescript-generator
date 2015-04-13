import * as _ from 'lodash';

import Field from './Field'

class MethodConverted implements Converted.IMethod {
    public name: string;
    public docText: string;
    public returnType: Converted.IReturnType;
    public parameters: Converted.IParameter[];
    public destructured: boolean;

    constructor(cls: IClass, property: IProperty) {
        this.name = property.name;
        this.docText = Field.getDocText(property);
        this.returnType = new ReturnTypeConverted(cls, property);
        this.destructured = property.destructured;
        this.parameters = this._getParameters(cls, property);

        if (!property.doc) {


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
        var infer = inference.types.handler({cls, property, type: 'any'});
        if (infer) {
            returnValue = infer;
        }

        if (property.doc && property.doc.returnValues && property.doc.returnValues.length) {
            returnValue = getReturnValue(cls, property, property.doc.returnValues, cls.project, returnDocs);
        }

        if (property.name === "constructor")
            propertyType = `(${signature})`;
        else
            propertyType = `(${signature}): ${returnValue}`;
    }

    private _getParameters(cls: IClass, property: IProperty) {
        var params = property.params;
        var names = property.paramNames;
        var docs = property.doc && property.doc.arguments;

        var merge = property.params.map((param, index) => ({
            param,
            index,
            name: _.find(names, x => x === param.name),
            doc: _.find(docs, x => x.name === param.name)
        }))
    }

    public _consolidateParams(cls: IClass, property: IProperty, params: any[]) {
        return _.map(params, (param, index) => conslidateParam(cls, property, param, index));
    }

    public _conslidateParam(cls: IClass, property: IProperty, param, index) {
        var n = param.name;
        if (!n || n.match(/^\d/)) {
            n = ('unknown' + index);
        }
        n = inference.parameterNames.handler({cls, property, name: n, index}) || n;
        var res = `${n}: `;

        if (param.children && param.children.length) {
            res += `{ ${consolidateParams(cls, property, param.children).join('; ') } }`
        } else if (param.children) {
            res += 'Object';
        } else {
            var fakeProperty: IProperty = <any>{
                paramNames: null,
                name: '',
                type: "primitive",
                bindingType: "",
                doc: null
            }

            var t = getType(cls, fakeProperty, param.name, fakeProperty.type);

            if (_.startsWith(t, getProjectName(cls.project)) + '.') {
                t = t.substr(t.indexOf('.') + 1);
            }

            if (t.indexOf('/') === 0) {
                t = 'any'
            }

            res += t;
        }

        return res;
    }

    public _getParam(cls: IClass, property: IProperty, paramName: string, index: number, docs?: string[]) {
        if (property.doc && property.doc.arguments) {
            var argument = _.find(property.doc.arguments, z => z.name == paramName);
            if (argument) {
                docs = docs || [];
                var argName = inference.parameterNames.handler({cls, property, name: argument.name, index});

                var result = `${argName}: ${getDocArgumentType(cls, property, argument, docs, cls.project) }`

                return { result, doc: docs.join('\n') || '' };
            }
        }

        var t = inference.parameterTypes.handler({cls, property, name: paramName, index}) || 'any';
        var n = inference.parameterNames.handler({cls, property, name: paramName, index});
        console.log('getParam', n)
        return { result: n + ': ' + t, doc: '' };
    }
}

export class ReturnTypeConverted implements Converted.IReturnType {
    public type: string;
    public docText: string;
    constructor(cls: IClass, property: IProperty) {

    }

    public _getReturnValue(cls: IClass, property: IProperty, returnValues: IDocReturn[], project: string, docs: string[]) {
        var values = _.map(returnValues, returnValue => {
            docs.push(`${returnValue.type || 'any'} - ${returnValue.description}`)
            if (returnValue.type === null)
                return 'any';

            if (returnValue.type === "Function") {
                var returnType = getReturnType(cls, property, returnValue);
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

}

export default MethodConverted;
