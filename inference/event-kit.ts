import * as _ from "lodash";

var ignoreEventKitProperties : Inference.IgnoreProperty =
    (cls:IClass, property:IProperty) => cls.project === "event-kit" && property.type !== "function";

var emitterHandler : Inference.ParameterType = (cls, property, name) => cls.project === "event-kit" && cls.name === "Emitter" && _.contains(name.toLowerCase(), "handler") && "(value: any) => void";
var emitterEventName : Inference.ParameterName = (cls, property, name) => cls.project === "event-kit" && cls.name === "Emitter" && property.name === "off" && name === "eventName" && name;
var disposableEventName : Inference.ParameterName = (cls, property, name) => cls.project === "event-kit" && cls.name === "Disposable" && property.name === "off" && name === "eventName" && name;

var disposedType : Inference.ParameterType = (cls, property, name) => name === "disposed" && "boolean";
disposedType.order = 1000;
var disposableType : Inference.ParameterType = (cls, property, name) => name === "disposable" && "EventKit.Disposable";
disposableType.order = 1000;
var disposedName : Inference.ParameterName = (cls, property, name) => name === "disposed" && "disposed?";
disposedName.order = 1000;

var result : Inference = {
    ignoreProperties: [ignoreEventKitProperties],
    parameterTypes: [emitterHandler, disposedType, disposableType],
    parameterNames: [emitterEventName, disposableEventName, disposedName]
}
export default result;
