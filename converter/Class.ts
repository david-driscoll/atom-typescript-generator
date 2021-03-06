import * as _ from 'lodash';
import {projectTypeMap, knownClasses, knownSuperClasses, exported} from '../metadata';
import Field from './Field'
import Method from './Method'
import getMappedType from "../getMappedType";
import inference from "../inference";

class ClassConverted implements Converted.IClass {
    public name: string;
    public superClass: string;
    public docText: string;
    public fields: Converted.IField[];
    public methods: Converted.IMethod[];
    public staticFields: Converted.IField[];
    public staticMethods: Converted.IMethod[];
    public content: string[];
    public export: boolean;

    constructor(private _project: Converted.IProject, cls: IClass) {
        this.name = cls.name;
        if (cls.doc)
            this.docText = cls.doc.summary;
        else
            this.docText = cls.name + '\nThis class was not documented by atomdoc, assume it is private. Use with caution.'

        this.superClass = this._getSuperType(cls, cls.superClass);

        var properties = _(cls.properties)
            .filter(property => !inference.ignoreProperties.handler({ cls, property }));

        this.fields = properties
            .filter(z => z.type !== 'function')
            .map(x => new Field(cls, x))
            .value();

        this.methods = properties.filter(z => z.type === 'function')
            .map(x => new Method(cls, x))
            .value();

        var staticProperties = _(cls.staticProperties)
            .filter(property => !inference.ignoreProperties.handler({ cls, property }));

        this.staticFields = staticProperties
            .filter(z => z.type !== 'function')
            .map(x => new Field(cls, x))
            .each(z => z.isStatic = true)
            .value();

        this.staticMethods = staticProperties.filter(z => z.type === 'function')
            .map(x => new Method(cls, x))
            .each(z => z.isStatic = true)
            .value();

        this.content = cls.content;
        this.export = false;
    }

    private _getSuperType(cls: IClass, superName: string) {
        var superClass = projectTypeMap[_.kebabCase(superName)] && projectTypeMap[_.kebabCase(superName)][this.name] || getMappedType(cls, superName);
        if (_.startsWith(superClass, this._project.displayName + '.')) {
            superClass = superClass.split('.')[1];
        }
        return superClass;
    }

    public emit({indent}: { indent: number }) {
        var lines = [];

        var docLines = this.docText.split('\n');
        lines.push('/**');
        _.each(docLines, x => lines.push(` * ${x}`));
        lines.push(' */');

        if (_.find(knownClasses, x => x === this.superClass)) {
            lines.push(`${this.export ? 'export ' : ''}class ${this.name} extends ${this.superClass} {`)
        } else if (_.find(knownSuperClasses, x => x === this.superClass)) {
            lines.push(`${this.export ? 'export ' : ''}class ${this.name} extends ${this.superClass} {`)
        } else if (this.superClass) {
            lines.push(`${this.export ? 'export ' : ''}class ${this.name} /*extends ${this.superClass}*/ {`)
        } else {
            lines.push(`${this.export ? 'export ' : ''}class ${this.name} {`)
        }

        _.map(this.staticFields, x => x.emit({ indent: indent + 4 })).forEach(str => {
            lines.push(str.substring(indent));
            lines.push('');
        });

        _.map(this.staticMethods, x => x.emit({ indent: indent + 4 })).forEach(str => {
            lines.push(str.substring(indent));
            lines.push('');
        });

        _.map(this.fields, x => x.emit({ indent: indent + 4 })).forEach(str => {
            lines.push(str.substring(indent));
            lines.push('');
        });

        _.map(this.methods, x => x.emit({ indent: indent + 4 })).forEach(str => {
            lines.push(str.substring(indent));
            lines.push('');
        });

        if (this.content.length) {
            lines.push('')
            lines.push(... this.content.map(z => _.repeat(' ', indent) + z));
        }

        lines.push(`}`)

        return lines.map(z => _.repeat(' ', indent) + z).join('\n');
    }
}

export default ClassConverted;
