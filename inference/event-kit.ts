import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.ignore().forProject("event-kit").forProperty(z => z.type !== "function").return(true);
    provider.paramType().forClass("Emitter").forName(name => _.contains(name.toLowerCase(), "handler")).return("...value: any[]");
    provider.paramName().forClass("Emitter").forName("eventName").compute(function({cls, property, name}) { return name; });
    provider.paramName().forClass("Emitter").forProperty("emit").forName("value").compute(function({cls, property, name}) { return '...' + name; });
    provider.paramType().forClass("Emitter").forProperty("emit").forName("value").return('any[]');
    //provider.paramType().forClass("Disposable").forProperty("off").forName("eventName").compute(function({cls, property, name}) { return name; });
    provider.paramType().order(1000).forName("disposed").return("boolean");
    provider.paramType().order(1000).forName("disposable").return("EventKit.Disposable");
    provider.paramName().order(1000).forName("disposed").return("disposed?");
}


/*var ignoreEventKitProperties: Inference.IgnoreProperty = function({cls, property}) {
    return cls.project === "event-kit" && property.type !== "function";
}

var emitterHandler: Inference.ParameterType = function({cls, property, name}) {
    return cls.project === "event-kit" && cls.name === "Emitter" && _.contains(name.toLowerCase(), "handler") && "(...value: any[]){ return void";
}

var emitterEventName: Inference.ParameterName = function({cls, property, name}) {
    return cls.project === "event-kit" && cls.name === "Emitter" && name === "eventName" && name;
}

var emitterEmitName: Inference.ParameterName = function({cls, property, name}) {
    console.log(cls.project, cls.name, property.name, name);
    return cls.project === "event-kit" && cls.name === "Emitter" && property.name === "emit" && name === "value" && '...' + name;
}

var emitterEmitType: Inference.ParameterType = function({cls, property, name}) {
    return cls.project === "event-kit" && cls.name === "Emitter" && property.name === "emit" && name === "value" && 'any[]';
}


var disposableEventName: Inference.ParameterName = function({cls, property, name}) {
    return cls.project === "event-kit" && cls.name === "Disposable" && property.name === "off" && name === "eventName" && name;
}

var disposedType: Inference.ParameterType = function({cls, property, name}) {
    return name === "disposed" && "boolean";
}
disposedType.order = 1000;
var disposableType: Inference.ParameterType = function({cls, property, name}) {
    return name === "disposable" && "EventKit.Disposable";
}
disposableType.order = 1000;
var disposedName: Inference.ParameterName = function({cls, property, name}) {
    return name === "disposed" && "disposed?";
}
disposedName.order = 1000;

var result: Inference = {
    ignoreProperties: [ignoreEventKitProperties],
    parameterTypes: [emitterEmitType, emitterHandler, disposedType, disposableType],
    parameterNames: [emitterEventName, disposableEventName, disposedName, emitterEmitName]
}
export default result;
*/
