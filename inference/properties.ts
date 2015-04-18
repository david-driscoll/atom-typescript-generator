import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.paramName()
        .order(-10000)
        .forProperty('arguments')
        .return('arguments_');
}
