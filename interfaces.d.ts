interface ICommon {
    name: string;
    type: string;
    bindingType: string;
    doc: IDoc;
}
interface IDoc {
    originalText: string;
    visibility: string;
    description: string;
    summary: string;
    type?: string;
    arguments?: IDocArgument[];
    returnValues?: IDocReturn[];
}
interface IDocArgument {
    name: string;
    description: string;
    type: string;
    isOptional: boolean;
    children?: IDocArgument[];
}
interface IDocReturn {
    type: string;
    description: string;
}
interface IClass extends ICommon {
    superClass?: string;
    properties: IProperty[];
    project: string;
}
interface IProperty extends ICommon {
    paramNames?: string[];
    params: any[];
    destructured: boolean;
}
interface IImport {
    name: string;
    type: string;
    bindingType: string;
    path?: string;
    module?: string;
    project: string;
    fromProject: string;
}

declare module Converted {
    interface IProject {
        name:string;
        displayName: string;
        classes: Converted.IClass[];
    }

    interface IClass {
        name: string;
        superClass: string;
        docText: string;
        fields: Converted.IField[];
        methods: Converted.IMethod[];
    }

    interface IField {
        name: string;
        type: string;
        docText: string;
    }

    interface IMethod {
        name: string;
        returnType: Converted.IReturnType;
        docText: string;
        parameters: Converted.IParameter[];
        destructured: boolean;
    }

    interface IReturnType {
        type: string;
        docText: string;
    }

    interface IParameter {
        name: string;
        type: string;
        docText: string;
        returnType?: Converted.IReturnType;
        parameters?: Converted.IParameter[];
    }
}


interface Inference {
    ignoreProperties?: Inference.IgnoreProperty[];
    arguments?: Inference.ArgumentType[];
    types?: Inference.TypeHandler;
    parameterTypes?: Inference.ParameterTypeHandler;
    names?: Inference.TypeHandler;
    parameterNames?: Inference.ParameterNameHandler;
}

interface InferenceMain {
    ignoreProperties?: Inference.IgnorePropertyHandler;
    arguments?: Inference.ArgumentTypeHandler;
    types?: Inference.TypeHandler;
    parameterTypes?: Inference.ParameterTypeHandler;
    names?: Inference.NameHandler;
    parameterNames?: Inference.ParameterNameHandler;
}

declare module Inference {
    interface Base {
        order?: number;
    }

    interface Handler<T extends Base> {

    }

    interface IgnorePropertyArguments {
        cls: IClass;
        property: IProperty;
    }

    interface TypeArguments extends IgnorePropertyArguments {
        type: string;
    }

    interface NameArguments extends IgnorePropertyArguments {
        name: string;
    }

    interface ArgumentTypeArguments {
        cls: IClass;
        property: IProperty;
        argument: IDocArgument;
        param: { name: string };
    }

    interface ParameterArguments {
        cls: IClass;
        property: IProperty;
        name: string;
        index: number;
    }

    interface IgnoreProperty extends Base {
        ({cls, property}: IgnorePropertyArguments): boolean;
    }

    interface IgnorePropertyHandler extends Array<IgnoreProperty> {
        handler({ cls, property } : IgnorePropertyArguments) : boolean;
    }

    interface ArgumentType extends Base {
        ({cls, property, argument, param} : ArgumentTypeArguments): string;
    }

    interface ArgumentTypeHandler extends Array<ArgumentType> {
        handler({cls, property, argument, param} : ArgumentTypeArguments) : string;
    }

    interface ParameterType extends Base {
        ({cls, property, name, index} : ParameterArguments): string;
    }

    interface ParameterTypeHandler extends Array<ParameterType> {
        handler({cls, property, name, index} : ParameterArguments) : string;
    }

    interface ParameterName extends Base {
        ({cls, property, name, index} : ParameterArguments): string;
    }

    interface ParameterNameHandler extends Array<ParameterName> {
        handler({cls, property, name, index} : ParameterArguments) ; string;
    }

    interface Type extends Base {
        ({cls, property, type} : TypeArguments): string;
    }

    interface TypeHandler extends Array<Type> {
        handler({cls, property, type} : TypeArguments) : string;
    }

    interface Name extends Base {
        ({cls, property, name} : NameArguments): string;
    }

    interface NameHandler extends Array<Name> {
        handler({cls, property, name} : NameArguments) : string;
    }
}
