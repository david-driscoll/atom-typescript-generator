import * as _ from "lodash";

class Builder {
    private predicates: ((arg: any) => any)[] = [];

    private predicateFor(key: string, value: string | Function) {
        console.log(key, value)
        if (typeof value === 'function') {
            this.predicates.push((obj) => _.has(obj, key) && value(obj[key]));
        } else {
            this.predicates.push((obj) => _.has(obj, key) && obj[key] === value);
        }
    }

    //public forClass(value: (cls: IClass) => any): Builder;
    public forClass(value: string|Function): Builder {
        this.predicateFor('cls', value);
        return this;
    }

    //public forClass(value: (cls: IClass) => any): Builder;
    public forProject(value: string|Function): Builder {
        this.predicates.push((obj) => {
            return _.has(obj, 'cls') && obj['cls'] && obj['cls']['project'] === value;
        })
        return this;
    }

    //public forProperty(value: (property: IProperty) => any): Builder;
    public forProperty(value: string|Function): Builder {
        this.predicateFor('property', value);
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
        this.predicateFor('argument', value);
        return this;
    }

    public return(result: any|Function) {
        console.log(result);
        if (typeof result === 'function')
            return (obj) => {
                //console.log(result(obj), this.predicates.map(z => z.toString()), _.all(this.predicates, (cb) => !!cb(obj)));
                if (!this.predicates.length)
                    return result(obj)
                return _.all(this.predicates, (cb) => !!cb(obj)) && result(obj);
            }
        return (obj) => {
            //console.log(result, this.predicates.map(z => z.toString()), _.all(this.predicates, (cb) => !!cb(obj)));
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

    public forProject(value: string): ArgumentTypeBuilder {
        this.builder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): ArgumentTypeBuilder;
    public forProperty(value: string|Function): ArgumentTypeBuilder
    public forProperty(value: any): ArgumentTypeBuilder {
        this.builder.forProperty(value);
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
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
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

    public forProject(value: string): ParameterBuilder {
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
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
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
    constructor(private handler: Inference.TypeNameHandler) {

    }

    public forClass(value: (cls: IClass) => any): TypeBuilder;
    public forClass(value: string|Function): TypeBuilder
    public forClass(value: any): TypeBuilder {
        this.builder.forClass(value);
        return this;
    }

    public forProject(value: string): TypeBuilder {
        this.builder.forProject(value);
        return this;
    }

    public forProperty(value: (property: IProperty) => any): TypeBuilder;
    public forProperty(value: string|Function): TypeBuilder
    public forProperty(value: any): TypeBuilder {
        this.builder.forProperty(value);
        return this;
    }

    public forType(value: (type: string) => any): TypeBuilder;
    public forType(value: string|Function): TypeBuilder
    public forType(value: any): TypeBuilder {
        this.builder.forType(value);
        return this;
    }

    public compute(result: Inference.TypeName): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
        this.handler.push(method);
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

    public forProject(value: string): IgnorePropertyBuilder {
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
        this.handler.push(method);
    }

    public return(result?: any): any {
        var method: any = this.builder.return(result);
        method.order = this._order;
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
        return new TypeBuilder(this.inference.types);
    }

    public paramName() {
        return new ParameterBuilder(this.inference.parameterNames);
    }

    public paramType() {
        return new ParameterBuilder(this.inference.parameterTypes);
    }

    public ignore() {
        return new IgnorePropertyBuilder(this.inference.ignoreProperties);
    }

    public argumentType() {
        return new ArgumentTypeBuilder(this.inference.arguments);
    }
}
