import * as _ from 'lodash';
import inference from "../inference";
import ProjectConverted from './Project';
import {knownClasses, knownSuperClasses, projectTypeMap, classes} from "../metadata";

class FieldConverted implements Converted.IField {
    public name: string;
    public docText: string;
    public type: string;
    public isStatic = false;

    constructor(cls: IClass, property: IProperty) {
        this.name = property.name;
        this.docText = FieldConverted.getDocText(property);
        this.type = this._getPropertyType(cls, property);
        this.type = inference.remapTypes.handler({ cls, property, type: this.type });
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
        if (property.doc && property.doc.description) {
            var type = property.doc.description;
            if (type.indexOf('{') > -1 && type.indexOf('}') > -1) {
                type = type.substr(type.indexOf('{') + 1);
                type = type.substr(0, type.indexOf('}'));

                //console.log(type, projectTypeMap[type])
                var typeCls = _.find(classes, x => x.name == type);
                if (typeCls) {
                    if (typeCls.project === cls.project) {
                        return typeCls.name;
                    } else {
                        return `${ProjectConverted.getProjectDisplayName(typeCls.project) }.${typeCls.name}`;
                    }
                }
            }
        }
        var potential = inference.types.handler({ cls, property, type: property.type })
        if (potential) return potential;

        if (_.find(knownSuperClasses, x => x == property.type) || _.find(knownClasses, x => x == property.type)) {
            return projectTypeMap[_.kebabCase(property.type)] && projectTypeMap[_.kebabCase(property.type)][this.name] || property.type
        }
        return 'any /* default */'
    }

    public emit({indent}: { indent: number }) {
        var lines = [];

        var docLines = this.docText.split('\n');
        lines.push('/**');
        _.each(docLines, x => lines.push(` * ${x}`));
        lines.push(' */');

        var field = `${this.name}: ${this.type};`;
        if (this.isStatic)
            field = 'static ' + field;
        lines.push(field);

        return lines.map(z => _.repeat(' ', indent) + z).join('\n');
    }
}

export default FieldConverted;
