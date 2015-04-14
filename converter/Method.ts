import * as _ from 'lodash';

import getMappedType from "../getMappedType";
import extractArrayType from "../extractArrayType";
import getReturnType from '../getReturnType';
import Field from './Field';
import Parameter from './Parameter';
import inference from '../inference';

class MethodConverted implements Converted.IMethod {
    public name: string;
    public docText: string;
    public returnType: Converted.IReturnType[];
    public parameters: Converted.IParameter[];
    public destructured: boolean;

    constructor(cls: IClass, property: IProperty) {
        this.name = property.name;
        this.docText = Field.getDocText(property);
        if (property.doc && property.doc.returnValues && property.doc.returnValues.length) {
            this.returnType = _.map(property.doc.returnValues, z=> new DocReturnTypeConverted(cls, property, z));
        } else {
            this.returnType = [new ReturnTypeConverted(cls, property)]
        }
        this.destructured = property.destructured;
        this.parameters = this._getParameters(cls, property);
    }

    private _getParameters(cls: IClass, property: IProperty) {
        var params = property.params || [];
        var names = property.paramNames;
        var docs = property.doc && property.doc.arguments;

        var merge = params.map((param, index) => ({
            param,
            index,
            paramName: _.find(names, x => x === param.name) || param.name,
            doc: _.find(docs, x => x.name === param.name)
        }));

        if (_.find(merge, x=> x.param.name == '0')) {
            console.log(params)
            console.log(merge)
        }

        return merge.map(x => new Parameter(cls, property, x));
    }

    public emit({indent}: { indent: number }) {
        var lines = [];

        if (this.docText) {
            var docLines = this.docText.split('\n');
            lines.push('/**');
            _.each(docLines, x => lines.push(` * ${x}`));
            if (this.parameters.length) {
                _.each(this.parameters, x => {
                    if (x.docText)
                        x.docText.split('\n').forEach(z => lines.push(z));
                })
            }
            if (this.returnType.length) {
                _.each(this.returnType, x => {
                    if (x.docText)
                        lines.push(x.docText);
                });
            } else {
                // any?
            }
            lines.push(' */');
        }

        if (this.name === "constructor") {
            var field = `${this.name}(${this.parameters.map(z => z.emit({indent:0})).join(', ')});`;
            lines.push(field);
        } else {
            var field = `${this.name}(${this.parameters.map(z => z.emit({indent:0})).join(', ')}) : ${_.unique(this.returnType.map(z => z.type)).join(' | ')};`;
            lines.push(field);
        }


        return lines.map(z => _.repeat(' ', indent) + z).join('\n');
    }
}

export class DocReturnTypeConverted implements Converted.IReturnType {
    public type: string;
    public docText: string;
    constructor(cls: IClass, property: IProperty, returnValue:IDocReturn) {
        this.type = this._getReturnValue(cls, property, returnValue);
    }

    public _getReturnValue(cls: IClass, property: IProperty, returnValue:IDocReturn) {
        this.docText = returnValue.description;
        if (returnValue.type === null)
            return 'any';

        if (returnValue.type === "Function") {
            var returnType = getReturnType(cls, property, returnValue);
            return `() => ${returnType}`
        } else if (returnValue.type == 'Array') {
            return extractArrayType(cls, returnValue);
        } else if (returnValue.type === "Boolean" || returnValue.type === "String" || returnValue.type === "Number") {
            return returnValue.type.toLowerCase();
        } else if (returnValue.type) {
            return getMappedType(cls, returnValue.type);
        }

        return 'any';
    }
}

export class ReturnTypeConverted implements Converted.IReturnType {
    public type: string;
    public docText: string;
    constructor(cls: IClass, property: IProperty) {
        this.type = inference.types.handler({cls, property, type:'any'}) || 'any';
        this.docText = '';
    }
}

export default MethodConverted;
