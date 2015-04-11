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


interface Inference {
    ignoreProperties?: Inference.IgnoreProperty[];
    arguments?: Inference.ArgumentType[];
    parameterTypes?: Inference.ParameterType[];
    parameterNames?: Inference.ParameterName[];
    types?: Inference.TypeName[];
}

interface InferenceMain {
    ignoreProperties?: Inference.IgnorePropertyHandler;
    arguments?: Inference.ArgumentTypeHandler;
    parameterTypes?: Inference.ParameterTypeHandler;
    parameterNames?: Inference.ParameterNameHandler;
    types?: Inference.TypeNameHandler;
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

    interface TypeName extends Base {
        ({cls, property, type} : TypeArguments): string;
    }

    interface TypeNameHandler extends Array<TypeName> {
        handler({cls, property, type} : TypeArguments) : string;
    }
}
