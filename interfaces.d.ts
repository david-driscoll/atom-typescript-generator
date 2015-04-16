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
    staticProperties: IProperty[];
    project: string;
    content: string[];
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
interface IExport {
    error?: any;
    project: string;
    values: string[];
}

declare module Converted {
    interface IEmitter {
        emit({indent}: { indent: number }): string;
    }

    interface IProject extends IEmitter {
        name: string;
        nodeName: string;
        displayName: string;
        references: IImport[];
        classes: Converted.IClass[];
        notTracking: string[];
        package: { name: string; version: string };
        exports: IExport[];
    }

    interface IImport {
        project: string;
        projectName: string;
        projectNodeName: string;
    }

    interface IExport {
        project?: string;
        projectName?: string;
        projectNodeName?: string;
        name: string;
    }

    interface IClass extends IEmitter {
        name: string;
        superClass: string;
        docText: string;
        fields: Converted.IField[];
        methods: Converted.IMethod[];
        export: boolean;
    }

    interface IField extends IEmitter {
        name: string;
        isStatic: boolean;
        type: string;
        docText: string;
    }

    interface IMethod extends IEmitter {
        name: string;
        isStatic: boolean;
        returnType: Converted.IReturnType[];
        docText: string;
        parameters: Converted.IParameter[];
        destructured: boolean;
    }

    interface IReturnType {
        type: string;
        docText: string;
    }

    interface IParameter extends IEmitter {
        name: string;
        type: string;
        docText: string;
        returnType?: Converted.IReturnType;
        parameters?: Converted.IParameter[];
    }
}

interface InferenceMain {
    ignoreProperties?: Inference.IgnorePropertyHandler;
    arguments?: Inference.ArgumentTypeHandler;
    types?: Inference.TypeHandler;
    parameterTypes?: Inference.ParameterTypeHandler;
    names?: Inference.NameHandler;
    parameterNames?: Inference.ParameterNameHandler;
    remapTypes?: Inference.RemapTypeHandler;
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
        handler({ cls, property }: IgnorePropertyArguments): boolean;
    }

    interface ArgumentType extends Base {
        ({cls, property, argument, param}: ArgumentTypeArguments): string;
    }

    interface ArgumentTypeHandler extends Array<ArgumentType> {
        handler({cls, property, argument, param}: ArgumentTypeArguments): string;
    }

    interface ParameterType extends Base {
        ({cls, property, name, index}: ParameterArguments): string;
    }

    interface ParameterTypeHandler extends Array<ParameterType> {
        handler({cls, property, name, index}: ParameterArguments): string;
    }

    interface ParameterName extends Base {
        ({cls, property, name, index}: ParameterArguments): string;
    }

    interface ParameterNameHandler extends Array<ParameterName> {
        handler({cls, property, name, index}: ParameterArguments); string;
    }

    interface Type extends Base {
        ({cls, property, type}: TypeArguments): string;
    }

    interface TypeHandler extends Array<Type> {
        handler({cls, property, type}: TypeArguments): string;
    }

    interface Name extends Base {
        ({cls, property, name}: NameArguments): string;
    }

    interface NameHandler extends Array<Name> {
        handler({cls, property, name}: NameArguments): string;
    }

    interface RemapType extends Base {
        ({cls, property, type}: TypeArguments): string;
    }

    interface RemapTypeHandler extends Array<RemapType> {
        handler({cls, property, type}: TypeArguments): string;
    }
}
