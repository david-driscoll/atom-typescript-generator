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

    interface IgnoreProperty extends Base {
        (cls: IClass, property: IProperty): boolean;
    }

    interface IgnorePropertyHandler extends Array<IgnoreProperty> {
        handler: (cls: IClass, property: IProperty) => boolean;
    }

    interface ArgumentType extends Base {
        (cls: IClass, property: IProperty, argument: IDocArgument, param: { name: string }): string;
    }

    interface ArgumentTypeHandler extends Array<ArgumentType> {
        handler: (cls: IClass, property: IProperty, argument: IDocArgument, param: { name: string }) => string;
    }

    interface ParameterType extends Base {
        (cls: IClass, property: IProperty, name: string): string;
    }

    interface ParameterTypeHandler extends Array<ParameterType> {
        handler: (cls: IClass, property: IProperty, name: string) => string;
    }

    interface ParameterName extends Base {
        (cls: IClass, property: IProperty, name: string): string;
    }

    interface ParameterNameHandler extends Array<ParameterName> {
        handler: (cls: IClass, property: IProperty, name: string) =>string;
    }

    interface TypeName extends Base {
        (cls: IClass, property: IProperty, type: string): string;
    }

    interface TypeNameHandler extends Array<TypeName> {
        handler: (cls: IClass, property: IProperty, type: string) => string;
    }
}
