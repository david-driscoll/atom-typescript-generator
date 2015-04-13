import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.type()
        .forProject("text-buffer")
        .forPropertyName(name => {
            return _.contains(name.toLowerCase(), "range")
        })
        .return("Range");
}
