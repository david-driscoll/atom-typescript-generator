import getMappedType from "./getMappedType";
export default function extractArrayType(cls: IClass, object: any) {
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
