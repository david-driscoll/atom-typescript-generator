import * as _ from 'lodash';
import getMappedType from "../getMappedType";
import extractArrayType from "../extractArrayType";
import getReturnType from '../getReturnType';
import inference from "../inference";

class ParameterConverted implements Converted.IParameter {
    public name: string;
    public type: string;
    public docText: string;
    public parameters: Converted.IParameter[];
    public returnType: Converted.IReturnType;

    constructor(cls: IClass, property: IProperty, { param, index, paramName, doc}: { param: { name: string, isOptional: boolean, children: ({ name: string, isOptional: boolean, children: any[] })[] }, index: number, paramName: string, doc: IDocArgument }) {
        var name = (doc && doc.name) || name;
        if (!param.name || param.name.match(/^\d/)) {
            name = 'unknown' + index
        }
        name = paramName || name;

        this.name = inference.parameterNames.handler({ cls, property, name: name, index }) || name;
        this.parameters = [];

        if (param.children && param.children.length) {
            this.parameters = param.children.map(z =>
                new ParameterConverted(cls, property, {
                    param: z,
                    index,
                    paramName: z.name,
                    doc: _.find(doc && doc.children || [], x => x.name === z.name)
                }));
        } else if (param.children) {
            this.type = 'Object';
        } else {
            this.type = inference.parameterTypes.handler({ cls, property, name: name, index }) || 'any';
        }

        if (doc) {
            if (doc.type === 'Object') {
                this.type = 'Object';
            } else if (doc.type === "Boolean" || doc.type === "String" || doc.type === "Number") {
                this.type = doc.type.toLowerCase();
            } else if (doc.type) {
                this.type = getMappedType(cls, doc.type);
            }
            this.docText = `@param ${this.name} - ${doc.description}`;
            if (this.parameters.length) {
                _.each(this.parameters, x => {
                    this.docText += '\n' + x.docText;
                });
            }
        }
    }

    public emit({indent}: { indent: number }) {
        return `${this.name} : ${this.type}`;
    }
}

export default ParameterConverted;
