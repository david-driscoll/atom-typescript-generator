import * as _ from 'lodash';
import getMappedType from "../getMappedType";
import inference from "../inference";

class ParameterConverted implements Converted.IParameter {
    public name: string;
    public type: string;
    public docText: string;
    public parameters: Converted.IParameter[];
    public returnType: Converted.IReturnType;

    constructor(cls: IClass, property: IProperty, { param, index, paramName, doc}: { param: { name: string, isOptional: boolean, children: ({ name: string, isOptional: boolean, children: any[] })[] }, index: number, paramName: string, doc: IDocArgument }) {
        var name = ((!param.name || param.name.match(/^\d/)) ? 'unknown' + index : (doc && doc.name) || name);
        this.name = inference.parameterNames.handler({ cls, property, name: name, index }) || name;

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

        }

        if (doc) {
            this.docText = doc.description;
            if (doc.type === 'Object') {
                this.type = 'Object';
            } else if (doc.type === "Function") {
                this.returnType = new ParameterReturnTypeConverted(cls, property, param, doc);
            } else if (doc.type === "Boolean" || doc.type === "String" || doc.type === "Number") {
                this.type = doc.type.toLowerCase();
            } else if (doc.type) {
                this.type = getMappedType(cls, doc.type);
            }
        }

        var t = inference.parameterTypes.handler({ cls, property, name: paramName, index }) || 'any';
    }
}

export class ParameterReturnTypeConverted implements Converted.IReturnType {
    public type: string;
    public docText: string;
    constructor(cls: IClass, property: IProperty, param: { name:string; isOptional: boolean, children: any[] }, argument: IDocArgument) {

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

}

export default ParameterConverted;
