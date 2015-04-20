import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.type()
        .order(1000)
        .forProject("text-buffer")
        .forPropertyName(name =>  _.contains(name.toLowerCase(), "range") || _.contains(name.toLowerCase(), "range?"))
        .return("Range");

        provider.paramType()
            .forClass('Cursor')
            .forProperty(property => {
                return _.endsWith(property.name, "Ranges")
            })
            .compute(function({cls, property, name, index}) {
                return '[number, number]';
            });

        provider.type()
            .forClass('Cursor')
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

        provider.remapType()
            .forType((type) => type === "TextBuffer.Point")
            .return("TextBuffer.Point | [number, number]")

        //TextBuffer.Range
}
