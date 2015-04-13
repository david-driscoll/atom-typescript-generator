import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.type()
        .order(1000)
        .forProject("text-buffer")
        .forPropertyName(name =>  _.contains(name.toLowerCase(), "range") || _.contains(name.toLowerCase(), "range?"))
        .return("Range");
}
