import * as _ from 'lodash';
import {projectTypeMap} from '../metadata';
import Field from './Field'
import Method from './Method'
import getMappedType from "../getMappedType";

class ClassConverted implements Converted.IClass {
    public name: string;
    public superClass: string;
    public docText: string;
    public fields: Converted.IField[];
    public methods: Converted.IMethod[];

    constructor(private _project: Converted.IProject, cls: IClass) {
        this.name = cls.name;
        this.docText = cls.doc.summary;
        this.superClass = this._getSuperType(cls, cls.superClass);

        this.fields = cls.properties
            .filter(z => z.type !== 'function')
            .map(x => new Field(cls, x));

        this.methods = cls.properties
            .filter(z => z.type === 'function')
            .map(x => new Method(cls, x));
    }

    private _getSuperType(cls: IClass, superName: string) {
        return projectTypeMap[_.kebabCase(superName)] && projectTypeMap[_.kebabCase(superName)][this.name] || getMappedType(cls, superName);
    }
}

export default ClassConverted;
