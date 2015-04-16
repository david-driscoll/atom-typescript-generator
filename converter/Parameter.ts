import * as _ from 'lodash';
import getMappedType from "../getMappedType";
import extractArrayType from "../extractArrayType";
import getReturnType from '../getReturnType';
import inference from "../inference";
import Project from "./Project";

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
        }

        this.type = inference.parameterTypes.handler({ cls, property, name: name, index }) || this.type || 'any';

        if (doc) {
            if (doc.type === 'Object') {
                this.type = 'Object';
            } else if (doc.type === 'Array') {
                this.type = 'any[]';
            } else if (doc.type === "Boolean" || doc.type === "String" || doc.type === "Number") {
                this.type = doc.type.toLowerCase();
            } else if (doc.type) {
                this.type = inference.parameterTypes.handler({ cls, property, name: name, index }) || getMappedType(cls, doc.type);
            }

            this.docText = `@param ${this.name} - ${doc.description}`;
            if (this.parameters.length) {
                _.each(this.parameters, x => {
                    this.docText += '\n' + x.docText;
                });
            }
        }

        if (_.startsWith(this.type, Project.getProjectDisplayName(cls.project) + '.')) {
            this.type = this.type.split('.')[1];
        }
        this.type = inference.remapTypes.handler({ cls, property, type: this.type });
    }

    public emit({indent}: { indent: number }) {
        if (this.parameters.length) {
            return `${this.name} : (${this.parameters.map(z => z.emit({indent}))}) => ${this.type}`
        } else {
            return `${this.name} : ${this.type}`;
        }
    }
}

export default ParameterConverted;
