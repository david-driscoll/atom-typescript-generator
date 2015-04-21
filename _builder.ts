import * as _ from "lodash";

class Builder {
    public predicates: ((arg: any) => any)[] = [];
    public values: any[] = [];

    public predicateFor(key: string, value: string | Function) {
        if (typeof value === 'function') {
            this.predicates.push((obj) => _.has(obj, key) && value(obj[key]));
        } else {
            this.predicates.push((obj) => _.has(obj, key) && obj[key] === value);
        }
        this.values.push(value.toString());
    }

    private predicateForName(key: string, value: string) {
        this.predicates.push((obj) => _.has(obj, key) && obj[key]['name'] === value);
        this.values.push(value.toString());
    }

    //public forClass(value: (cls: IClass) => any): Builder;
    public forClass(value: string|Function): Builder {
        if (typeof value === 'string') {
            this.predicateForName('cls', value);
        } else {
            this.predicateFor('cls', value);
        }
        return this;
    }

    //public forClass(value: (cls: IClass) => any): Builder;
    public forProject(value: string|Function): Builder {
        if (typeof value === 'function') {
            this.predicates.push((obj) => _.has(obj, 'cls') && obj['cls'] && value(obj['cls']['project']));
        } else {
            this.predicates.push((obj) => {
                return _.has(obj, 'cls') && obj['cls'] && obj['cls']['project'] === value;
            })
        }
        this.values.push(value.toString());
        return this;
    }

    //public forProperty(value: (property: IProperty) => any): Builder;
    public forProperty(value: string|Function): Builder {
        if (typeof value === 'string') {
            this.predicateForName('property', value);
        } else {
            this.predicateFor('property', value);
        }
        return this;
    }

    //public forProperty(value: (property: IProperty) => any): Builder;
    public forPropertyName(value: string|Function): Builder {
        if (typeof value === 'function') {
            this.predicates.push((obj) => {
                if (_.has(obj, 'property') && obj['property']) {
                    return value(obj['property']['name'] || '');
                }
            });
        } else {
            this.predicates.push((obj) => {
                if (_.has(obj, 'property') && obj['property']) {
                    return obj['property']['name'] === value;
                }
            })
        }
        this.values.push(value.toString());
        return this;
    }

    //public forName(value: (name: string) => any): Builder;
    public forName(value: string|Function): Builder {
        this.predicateFor('name', value);
        return this;
    }

    //public forType(value: (type: string) => any): Builder;
    public forType(value: string|Function): Builder {
        this.predicateFor('type', value);
        return this;
    }

    //public forParam(value: (param: { name: string }) => any): Builder;
    public forParam(value: string|Function): Builder {
        this.predicateFor('param', value);
        return this;
    }

    //public forArgument(value: (argument: IDocArgument) => any): Builder;
    public forArgument(value: string|Function): Builder {
        if (typeof value === 'string') {
            this.predicateForName('argument', value);
        } else {
            this.predicateFor('argument', value);
        }
        return this;
    }

    public return(result: any|Function) {
        if (typeof result === 'function')
            return (obj) => {
                if (!this.predicates.length)
                    return result(obj)
                return _.all(this.predicates, (cb) => !!cb(obj)) && result(obj);
            }
        return (obj) => {
            if (!this.predicates.length)
                return result;
            return _.all(this.predicates, (cb) => !!cb(obj)) && (result);
        }
    }
}

class ArgumentTypeBuilder {
    private builder = new Builder();
    constructor(private handler: Inference.ArgumentTypeHandler) {

    }

    public forClass(value: (cls: IClass) => any): ArgumentTypeBuilder;
    public forClass(value: string|Function): ArgumentTypeBuilder
    public forClass(value: any): ArgumentTypeBuilder {
        this.builder.forClass(value);
        return this;
    }

    public forProject(value: (name: string) => any): ArgumentTypeBuilder;
    public forProject(value: string): ArgumentTypeBuilder;
    public forProject(value: any): ArgumentTypeBuilder {
        this.builder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): ArgumentTypeBuilder;
    public forProperty(value: string|Function): ArgumentTypeBuilder
    public forProperty(value: any): ArgumentTypeBuilder {
        this.builder.forProperty(value);
        return this;
    }

    public forPropertyName(value: (property: string) => any): ArgumentTypeBuilder;
    public forPropertyName(value: string|Function): ArgumentTypeBuilder
    public forPropertyName(value: any): ArgumentTypeBuilder {
        this.builder.forName(value);
        return this;
    }

    public forParam(value: (param: { name: string }) => any): ArgumentTypeBuilder;
    public forParam(value: string|Function): ArgumentTypeBuilder
    public forParam(value: any): ArgumentTypeBuilder {
        this.builder.forParam(value);
        return this;
    }

    public forArgument(value: (argument: IDocArgument) => any): ArgumentTypeBuilder;
    public forArgument(value: string|Function): ArgumentTypeBuilder
    public forArgument(value: any): ArgumentTypeBuilder {
        this.builder.forArgument(value);
        return this;
    }

    public compute(result: Inference.ArgumentType): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);
    }

    private _order = 0;
    public order(order: number) {
        this._order = order;
        return this;
    }
}

class ParameterBuilder {
    private builder = new Builder();
    constructor(private handler: Inference.ParameterTypeHandler |  Inference.ParameterNameHandler) {

    }

    public forClass(value: (cls: IClass) => any): ParameterBuilder;
    public forClass(value: string|Function): ParameterBuilder
    public forClass(value: any): ParameterBuilder {
        this.builder.forClass(value);
        return this;
    }

    public forProject(value: (name: string) => any): ParameterBuilder;
    public forProject(value: string): ParameterBuilder;
    public forProject(value: any): ParameterBuilder {
        this.builder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): ParameterBuilder;
    public forProperty(value: string|Function): ParameterBuilder
    public forProperty(value: any): ParameterBuilder {
        this.builder.forProperty(value);
        return this;
    }

    public forName(value: (name: string) => any): ParameterBuilder;
    public forName(value: string|Function): ParameterBuilder
    public forName(value: any): ParameterBuilder {
        this.builder.forName(value);
        return this;
    }

    public compute(result: Inference.ParameterType): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);
    }

    private _order = 0;
    public order(order: number) {
        this._order = order;
        return this;
    }
}

class TypeBuilder {
    private builder = new Builder();
    private parameterTypeBuilder = new Builder();
    constructor(private handler: Inference.TypeHandler | Inference.RemapTypeHandler, private parameterTypeHandler?: Inference.ParameterTypeHandler, private _paramOnly: boolean = false) {
        if (_paramOnly) {
            this.builder.predicateFor("param", z => z === true);
        }
    }

    public forClass(value: (cls: IClass) => any): TypeBuilder;
    public forClass(value: string|Function): TypeBuilder
    public forClass(value: any): TypeBuilder {
        this.builder.forClass(value);
        this.parameterTypeBuilder.forClass(value);
        return this;
    }

    public forProject(value: (name: string) => any): TypeBuilder;
    public forProject(value: string): TypeBuilder;
    public forProject(value: any): TypeBuilder {
        this.builder.forProject(value);
        this.parameterTypeBuilder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): TypeBuilder;
    public forProperty(value: string|Function): TypeBuilder
    public forProperty(value: any): TypeBuilder {
        this.builder.forProperty(value);
        this.parameterTypeBuilder.forProperty(value);
        return this;
    }

    public forPropertyName(value: (property: string) => any): TypeBuilder;
    public forPropertyName(value: string|Function): TypeBuilder
    public forPropertyName(value: any): TypeBuilder {
        this.builder.forPropertyName(value);
        this.parameterTypeBuilder.forName(value);
        return this;
    }

    public forType(value: (type: string) => any): TypeBuilder;
    public forType(value: string|Function): TypeBuilder
    public forType(value: any): TypeBuilder {
        this.builder.forType(value);
        this.parameterTypeBuilder.forType(value);
        return this;
    }

    public compute(result: Inference.Type): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);

        var method: any = this.parameterTypeBuilder.return(result);
        method.order = this._order;
        method.predicates = this.parameterTypeBuilder.values.concat([result.toString()]);
        if (this.parameterTypeHandler)
            this.parameterTypeHandler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);

        var method: any = this.parameterTypeBuilder.return(result);
        method.order = this._order;
        method.predicates = this.parameterTypeBuilder.values.concat([result.toString()]);
        if (this.parameterTypeHandler)
            this.parameterTypeHandler.push(method);
    }

    private _order = 0;
    public order(order: number) {
        this._order = order;
        return this;
    }
}

class NameBuilder {
    private builder = new Builder();
    private parameterNameBuilder = new Builder();
    constructor(private handler: Inference.NameHandler, private parameterNameHandler: Inference.ParameterNameHandler) {

    }

    public forClass(value: (cls: IClass) => any): NameBuilder;
    public forClass(value: string|Function): NameBuilder
    public forClass(value: any): NameBuilder {
        this.builder.forClass(value);
        this.parameterNameBuilder.forClass(value);
        return this;
    }

    public forProject(value: (name: string) => any): NameBuilder;
    public forProject(value: string): NameBuilder;
    public forProject(value: any): NameBuilder {
        this.builder.forProject(value);
        this.parameterNameBuilder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): NameBuilder;
    public forProperty(value: string|Function): NameBuilder
    public forProperty(value: any): NameBuilder {
        this.builder.forProperty(value);
        this.parameterNameBuilder.forProperty(value);
        return this;
    }

    public forPropertyName(value: (property: string) => any): NameBuilder;
    public forPropertyName(value: string|Function): NameBuilder
    public forPropertyName(value: any): NameBuilder {
        this.builder.forPropertyName(value);
        this.parameterNameBuilder.forName(value);
        return this;
    }

    public forType(value: (type: string) => any): NameBuilder;
    public forType(value: string|Function): NameBuilder
    public forType(value: any): NameBuilder {
        this.builder.forType(value);
        this.parameterNameBuilder.forType(value);
        return this;
    }

    public compute(result: Inference.Name): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);

        var method: any = this.parameterNameBuilder.return(result);
        method.order = this._order - 1;
        method.predicates = this.parameterNameBuilder.values.concat([result.toString()]);
        this.parameterNameHandler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);

        var method: any = this.parameterNameBuilder.return(result);
        method.order = this._order - 1;
        method.predicates = this.parameterNameBuilder.values.concat([result.toString()]);
        this.parameterNameHandler.push(method);
    }

    private _order = 0;
    public order(order: number) {
        this._order = order;
        return this;
    }
}

class IgnorePropertyBuilder {
    private builder = new Builder();
    constructor(private handler: Inference.IgnorePropertyHandler) {

    }

    public forClass(value: (cls: IClass) => any): IgnorePropertyBuilder;
    public forClass(value: string|Function): IgnorePropertyBuilder;
    public forClass(value: any): IgnorePropertyBuilder {
        this.builder.forClass(value);
        return this;
    }

    public forProject(value: (name: string) => any): IgnorePropertyBuilder;
    public forProject(value: string): IgnorePropertyBuilder;
    public forProject(value: any): IgnorePropertyBuilder {
        this.builder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): IgnorePropertyBuilder;
    public forProperty(value: string|Function): IgnorePropertyBuilder
    public forProperty(value: any): IgnorePropertyBuilder {
        this.builder.forProperty(value);
        return this;
    }

    public compute(result: Inference.IgnoreProperty): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        method.predicates = this.builder.values.concat([result.toString()]);
        this.handler.push(method);
    }

    private _order = 0;
    public order(order: number) {
        this._order = order;
        return this;
    }
}

export class BuilderProvider {
    constructor(private inference: InferenceMain) {

    }

    public type() {
        return new TypeBuilder(this.inference.types, this.inference.parameterTypes);
    }

    public remapType(paramOnly: boolean = false) {
        return new TypeBuilder(this.inference.remapTypes, null, paramOnly);
    }

    public paramType() {
        return new ParameterBuilder(this.inference.parameterTypes);
    }

    public name() {
        return new NameBuilder(this.inference.names, this.inference.parameterNames);
    }

    public paramName() {
        return new ParameterBuilder(this.inference.parameterNames);
    }

    public ignore() {
        return new IgnorePropertyBuilder(this.inference.ignoreProperties);
    }

    public argumentType() {
        return new ArgumentTypeBuilder(this.inference.arguments);
    }
}
