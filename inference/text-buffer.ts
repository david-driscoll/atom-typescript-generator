import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function(provider: BuilderProvider) {
    provider.type()
        .order(-999)
        .forPropertyName(name => _.contains(name.toLowerCase(), "ranges") || _.contains(name.toLowerCase(), "ranges?"))
        .return("TextBuffer.Range[]");

    provider.type()
        .order(-999)
        .forPropertyName(name => _.contains(name.toLowerCase(), "range") || _.contains(name.toLowerCase(), "range?"))
        .return("TextBuffer.Range");
    provider.type()
        .order(-999)
        .forPropertyName(name => _.contains(name.toLowerCase(), "positions") || _.contains(name.toLowerCase(), "positions?"))
        .return("TextBuffer.Point[]");

    provider.type()
        .order(-999)
        .forPropertyName(name => _.contains(name.toLowerCase(), "position") || _.contains(name.toLowerCase(), "position?"))
        .return("TextBuffer.Point");

    provider.paramType()
        .forClass('Cursor')
        .forProperty(property => {
        return _.endsWith(property.name, "Ranges")
    })
        .compute(function({cls, property, name, index}) {
        return '[number, number]';
    });

    provider.type()
        .forPropertyName("getBuffer")
        .return("TextBuffer.TextBuffer");

    provider.type()
        .forClass('Cursor')
        .forPropertyName(name => name.toLowerCase() == "geturi")
        .return("string");

    provider.paramType()
        .forClass('Cursor')
        .forProperty(property => {
        return _.endsWith(property.name, "Ranges")
    })
        .compute(function({cls, property, name, index}) {
        return 'TextBuffer.Range[]';
    });

    provider.paramType()
        .order(1000)
        .forName(name => name && name.toLowerCase().indexOf("pixelposition") > -1)
        .return("{ top: number; left: number; }")

    provider.type()
        .order(1000)
        .forProperty(property => _.startsWith(property.name, "pixelPosition"))
        .return("{ top: number; left: number; }")

    provider.remapType(true)
        .forType((type) => type === "TextBuffer.Point")
        .compute(function({cls, property, type}) {
            console.log(cls.name, property.name, type);

            return "TextBuffer.Point | { row: number; column: number } | [number, number]";
        })
        //.return("TextBuffer.Point | { row: number; column: number } | [number, number]")

    //TextBuffer.Range
}
