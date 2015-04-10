import {endsWith, sortBy} from 'lodash'
import * as fs from 'fs'
import * as _ from "lodash";

import defaults from './inference/default'
var infer = {
    ignoreProperties: [],
    arguments: [],
    parameterTypes: [],
    parameterNames: [],
    types: []
};

fs.readdirSync('./inference').forEach(file => {
    if (endsWith(file, '.ts'))
        return;
    if (endsWith(file, 'default.js'))
        return;
    var inf: { default: Inference } = require(`./inference/${file}`);

    if (inf && inf.default) {
        if (inf.default.ignoreProperties) {
            infer.ignoreProperties.push(...inf.default.ignoreProperties);
        }
        if (inf.default.arguments) {
            infer.arguments.push(...inf.default.arguments);
        }
        if (inf.default.parameterTypes) {
            infer.parameterTypes.push(...inf.default.parameterTypes);
        }
        if (inf.default.parameterNames) {
            infer.parameterNames.push(...inf.default.parameterNames);
        }
        if (inf.default.types) {
            infer.types.push(...inf.default.types);
        }
    }
});

infer.ignoreProperties = sortBy(infer.ignoreProperties, x => x.order === undefined ? 0 : x.order);
infer.arguments = sortBy(infer.arguments, x => x.order === undefined ? 0 : x.order);
infer.parameterTypes = sortBy(infer.parameterTypes, x => x.order === undefined ? 0 : x.order);
infer.parameterNames = sortBy(infer.parameterNames, x => x.order === undefined ? 0 : x.order);
infer.types = sortBy(infer.types, x => x.order === undefined ? 0 : x.order);

infer.ignoreProperties.reverse();
if (defaults.ignoreProperties) {
    infer.ignoreProperties = infer.ignoreProperties.concat(defaults.ignoreProperties);
}

infer.arguments.reverse();
if (defaults.arguments) {
    infer.arguments = infer.arguments.concat(defaults.arguments);
}

infer.parameterTypes.reverse();
if (defaults.parameterTypes) {
    infer.parameterTypes = infer.parameterTypes.concat(defaults.parameterTypes);
}

infer.parameterNames.reverse();
if (defaults.parameterNames) {
    infer.parameterNames = infer.parameterNames.concat(defaults.parameterNames);
}

infer.types.reverse();
if (defaults.types) {
    infer.types = infer.types.concat(defaults.types);
}

var inference: InferenceMain = <any>infer;
inference.ignoreProperties.handler = (cls, property) => {
    var values = _(inference.ignoreProperties).chain().map(z => z(cls, property)).value();
    return _.any(values, z => !!z);
}

inference.arguments.handler = (cls, property, argument, param) => _(inference.arguments).chain().map(z => z(cls, property, argument, param)).filter(z => !!z).first();
inference.parameterTypes.handler = (cls, property, name) => _(inference.parameterTypes).chain().map(z => z(cls, property, name)).filter(z => !!z).first();
inference.parameterNames.handler = (cls, property, name) => _(inference.parameterNames).chain().map(z => z(cls, property, name)).filter(z => !!z).first();
inference.types.handler = (cls, property, type) => _(inference.types).chain().map(z => z(cls, property, type)).filter(z => !!z).first();

inference.arguments.push((cls, property, argument, param) => inference.parameterTypes.handler(cls, property, argument.name || (param && param.name)));


export default inference;
