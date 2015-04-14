import * as _ from 'lodash';
import inference from "../inference";
import {knownClasses} from "../metadata";

class FieldConverted implements Converted.IField {
    public name: string;
    public docText: string;
    public type: string;

    constructor(cls: IClass, property: IProperty) {
        this.name = property.name;
        this.docText = FieldConverted.getDocText(property);
        this.type = this._getPropertyType(cls, property);
    }

    public static getDocText(property: IProperty) {
        var result: string;
        if (property.doc) {
            result = property.doc.description;

            if (property.doc.visibility === "Private" || property.doc.visibility === "Section") {
                result += '\nThis field or method was marked private by atomdoc. Use with caution.';
            }
        } else {
            result = 'This field or method was not documented by atomdoc, assume it is private. Use with caution.'
        }

        return result;
    }

    private _getPropertyType(cls: IClass, property: IProperty) {
        var potential = inference.types.handler({cls, property, type: property.type})
        if (potential) return potential;

        if (_.find(knownClasses, x => x== property.type))
            return property.type;
        return 'any /* default */'
    }

    public emit({indent}: { indent: number }) {
        var lines = [];

        var docLines = this.docText.split('\n');
        lines.push('/**');
        _.each(docLines, x => lines.push(` * ${x}`));
        lines.push(' */');

        var field = `${this.name}: ${this.type};`;
        lines.push(field);

        return lines.map(z => _.repeat(' ', indent) + z).join('\n');
    }
}

export default FieldConverted;
