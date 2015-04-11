import {endsWith, sortBy} from 'lodash'
import * as fs from 'fs'
import * as _ from "lodash";
import {BuilderProvider} from "./_builder";

import defaults from './inference/default'
var inference: InferenceMain = <any> {
    ignoreProperties: [],
    arguments: [],
    parameterTypes: [],
    parameterNames: [],
    types: []
};

fs.readdirSync('./inference').forEach(file => {
    if (endsWith(file, '.ts'))
        return;
    var inf: { default: Function } = require(`./inference/${file}`);

    var provider = new BuilderProvider(inference);
    if (inf && inf.default) {
        inf.default(provider);
    }
});

inference.ignoreProperties = <any>sortBy(inference.ignoreProperties, x => x.order === undefined ? 0 : x.order);
inference.arguments = <any>sortBy(inference.arguments, x => x.order === undefined ? 0 : x.order);
inference.parameterTypes = <any>sortBy(inference.parameterTypes, x => x.order === undefined ? 0 : x.order);
inference.parameterNames = <any>sortBy(inference.parameterNames, x => x.order === undefined ? 0 : x.order);
inference.types = <any>sortBy(inference.types, x => x.order === undefined ? 0 : x.order);

//var inference: InferenceMain = <any>infer;
inference.ignoreProperties.handler = function({cls, property}) {
    //console.log('inference.ignoreProperties.handler', cls, property);
    var values = _(inference.ignoreProperties).chain().map(z => z({ cls, property })).value();
    return _.any(values, z => !!z);
}

inference.arguments.handler = function({cls, property, argument, param}) {
    //console.log('inference.arguments.handler', cls, property, argument, param);
    return _(inference.arguments).chain().map(z => z({ cls, property, argument, param })).filter(z => !!z).value()[0];
};
inference.parameterTypes.handler = function({cls, property, name, index}) {
    //console.log('inference.parameterTypes.handler', cls, property, name);
    /*if (_.contains(name,'unknown')) {
        //console.log(cls, property, name);
        process.exit();
    }*/

    return _(inference.parameterTypes).chain().map(z => z({ cls, property, name, index })).filter(z => !!z).value()[0];
};
inference.parameterNames.handler = function({cls, property, name, index}) {
    //console.log('inference.parameterTypes.handler', cls, property, name);
    /*if (_.contains(name,'unknown')) {
        //console.log(cls, property, name);
        process.exit();
    }*/
    console.log(_(inference.parameterNames).chain().map(z => z({ cls, property, name, index })).value())
    console.log(_(inference.parameterNames).chain().filter(z => !!z({ cls, property, name, index })).value()[0].toString())
    return _(inference.parameterNames).chain().map(z => z({ cls, property, name, index })).filter(z => !!z).value()[0];
};
inference.types.handler = function({cls, property, type}) {
    //console.log('inference.types.handler', cls, property, type);
    return _(inference.types).chain().map(z => z({ cls, property, type })).filter(z => !!z).value()[0];
};

////console.log(inference.parameterNames.map(z => z.toString()))

inference.arguments.push(function({cls, property, argument, param}) { return inference.parameterTypes.handler({ cls, property, name: argument.name || (param && param.name), index: _.indexOf(property.paramNames, argument.name || (param && param.name)) }) });


export default inference;
