import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
    provider.ignore()
        .order(-1000)
        .return(false);

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.endsWith(name.toLowerCase(), 'name'))
        .return("string");

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.endsWith(name.toLowerCase(), 'text') || _.endsWith(name.toLowerCase(), 'text?'))
        .return("string");

    provider.type()
        .order(-1000)
        .forPropertyName(name => (name.toLowerCase() === 'column' || name.toLowerCase() === 'row'))
        .return('number');

//    provider.name()
//        .order(-1000)
//        .compute(function({cls, property, name}) {
//            return name + '?'
//        });
    provider.paramName()
        .order(-1000)
        .compute(function({cls, property, name, index}) {
            return ((property.paramNames && property.paramNames[index]) || name) + '?'
        });
};

/*
var defaultParamName : Inference.ParameterName = function({cls, property, name}){ return name + '?';}
var nameType : Inference.ParameterType = function({cls, property, name}){ return _.contains(name.toLowerCase(), 'name') && "string";}
var columnRowType : Inference.ParameterType = function({cls, property, name}){ return (_.contains(name.toLowerCase(), 'column') || _.contains(name.toLowerCase(), 'row')) && "number";}
var defaltIgnore : Inference.IgnoreProperty = function({cls, property}){ return false; }

var result : Inference = {
    ignoreProperties: [defaltIgnore],
    parameterTypes: [nameType, columnRowType],
    parameterNames: [defaultParamName],
}
export default result;
*/
