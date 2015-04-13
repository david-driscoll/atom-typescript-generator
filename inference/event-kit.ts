import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.ignore()
        .forProject("event-kit")
        .forProperty(z => z.type !== "function")
        .return(true);

    provider.paramType()
        .forClass("Emitter")
        .forName(name => _.contains(name.toLowerCase(), "handler"))
        .return("...value: any[]");

    provider.paramName()
        .forClass("Emitter")
        .forName("eventName")
        .compute(function({cls, property, name}) { return name; });

    provider.paramName()
        .forClass("Emitter")
        .forProperty("emit")
        .forName("value")
        .compute(function({cls, property, name}) { return '...' + name; });

    provider.paramType()
        .forClass("Emitter")
        .forProperty("emit")
        .forName("value")
        .return('any[]');

    provider.paramType()
        .order(1000)
        .forName("disposable")
        .return("EventKit.Disposable");

//"add", "remove", "clear", "off", "emit"
    provider.type()
        .order(1000)
        .forPropertyName("dispose")
        .return("void")

    provider.type()
        .order(1000)
        .forProject("event-kit")
        .forPropertyName(name => _.contains(["dispose", "add", "remove", "clear", "off", "emit"], name))
        .return("void")
}
