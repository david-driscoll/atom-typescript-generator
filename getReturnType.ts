import inference from "./inference";
import getMappedType from "./getMappedType";

export default function getReturnType(cls: IClass, property: IProperty, argument: IDocArgument | IDocReturn) {
    var infer = inference.types.handler({cls, property, type: argument.type});
    if (infer) {
        return infer;
    }
    if (argument.type === "Function")
        return 'any';
    if (argument.type === "Array")
        return 'any[]'
    if (argument.type === "Boolean" || argument.type === "String" || argument.type === "Number") {
        return `${argument.type.toLowerCase() }[]`
    }
    return getMappedType(cls, argument.type) || 'any';
}
