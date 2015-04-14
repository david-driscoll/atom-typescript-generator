import * as _ from 'lodash';

import getMappedType from "../getMappedType";
import Field from './Field'
import Parameter from './Parameter'
import inference from "../inference";

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
    }

    private _getParameters(cls: IClass, property: IProperty) {
        var params = property.params;
        var names = property.paramNames;
        var docs = property.doc && property.doc.arguments;

        var merge = property.params.map((param, index) => ({
            param,
            index,
            paramName: _.find(names, x => x === param.name),
            doc: _.find(docs, x => x.name === param.name)
        }));

        return merge.map(x => new Parameter(cls, property, x));
    }
}

export class ReturnTypeConverted implements Converted.IReturnType {
    public type: string;
    public docText: string;
    constructor(cls: IClass, property: IProperty) {
        this.type = this._getReturnValue(cls, property);
    }

    public _getReturnValue(cls: IClass, property: IProperty, returnValues: IDocReturn[]) {
        var values = _.map(returnValues, returnValue => {
            docs.push(`${returnValue.type || 'any'} - ${returnValue.description}`)
            if (returnValue.type === null)
                return 'any';

            if (returnValue.type === "Function") {
                var returnType = getReturnType(cls, property, returnValue);
                return `() => ${returnType}`
            } else if (returnValue.type == 'Array') {
                return this._extractArrayType(cls, returnValue);
            } else if (returnValue.type === "Boolean" || returnValue.type === "String" || returnValue.type === "Number") {
                return returnValue.type.toLowerCase();
            } else if (returnValue.type) {
                return getMappedType(cls, returnValue.type);
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

    private _extractArrayType(cls: IClass, object: any) {
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
            return `${getMappedType(cls, arrayType) }[]`;
        }

        return 'any[]'
    }

}

export default MethodConverted;
