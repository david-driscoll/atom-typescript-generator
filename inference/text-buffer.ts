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

        provider.paramType()
            .forClass('Cursor')
            .forProperty(property => {
                return _.endsWith(property.name, "Ranges")
            })
            .compute(function({cls, property, name, index}) {
                return 'TextBuffer.Range[]';
            });

        provider.remapType()
            .forProperty(property => {
                console.log(property.name);
                return true;
            })
            .forType((type) => type === "TextBuffer.Point")
            .return("TextBuffer.Point | [number, number]")

        //TextBuffer.Range
}
