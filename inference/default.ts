import * as _ from "lodash";

var defaultParamName : Inference.ParameterName = (cls, property, name) => name + '?';
var nameType : Inference.ParameterType = (cls, property, name) => _.contains(name.toLowerCase(), 'name') && "string";
var columnRowType : Inference.ParameterType = (cls, property, name) => (_.contains(name.toLowerCase(), 'column') || _.contains(name.toLowerCase(), 'row')) && "number";
var defaltIgnore : Inference.IgnoreProperty = (cls, property) => false;

var result : Inference = {
    ignoreProperties: [defaltIgnore],
    parameterTypes: [nameType, columnRowType],
    parameterNames: [defaultParamName],
}
export default result;
