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
    types: [],
    remapTypes: [],
    hiddenClasses: []
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

inference.ignoreProperties = <any>sortBy(inference.ignoreProperties, x => -(x.order));
inference.arguments = <any>sortBy(inference.arguments, x => -(x.order));
inference.types = <any>sortBy(inference.types, x => -(x.order));
inference.parameterTypes = <any>sortBy(inference.parameterTypes, x => -(x.order));
inference.names = <any>sortBy(inference.names, x => -(x.order));
inference.parameterNames = <any>sortBy(inference.parameterNames, x => -(x.order));
inference.remapTypes = <any>sortBy(inference.remapTypes, x => -(x.order));

//console.log('ignoreProperties', inference.ignoreProperties.map((z:any) => z.predicates));
//console.log('arguments', inference.arguments.map((z:any) => z.predicates));
//console.log('types', inference.types.map((z:any) => z.predicates));
//console.log('parameterTypes', inference.parameterTypes.map((z:any) => z.predicates));
//console.log('names', inference.names.map((z:any) => z.predicates));
//console.log('parameterNames', inference.parameterNames.map((z:any) => z.predicates));


//var inference: InferenceMain = <any>infer;
inference.ignoreProperties.handler = function({cls, property}) {
    var values = _(inference.ignoreProperties).chain().map(z => z({ cls, property })).value();
    return _.any(values, z => !!z);
}

inference.arguments.handler = function({cls, property, argument, param}) {
    return _(inference.arguments).chain().map(z => z({ cls, property, argument, param })).filter(z => !!z).value()[0];
};

inference.parameterTypes.handler = function({cls, property, name, index}) {
    var result = _(inference.parameterTypes).chain().map(z => z({ cls, property, name, index })).filter(z => !!z).value()[0];
    return result;
};

inference.parameterNames.handler = function({cls, property, name, index}) {
    var result = _(inference.parameterNames).chain().map(z => z({ cls, property, name, index })).filter(z => !!z).value()[0];
    return result;
};

inference.types.handler = function({cls, property, type}) {
    return _(inference.types).chain().map(z => z({ cls, property, type })).filter(z => !!z).value()[0];
};

inference.remapTypes.handler = function({cls, property, type, param}) {
    _.each(inference.remapTypes, remap => {
        var result = remap({ cls, property, type, param });
        if (result)
            type = result;
    });
    return type;
};

inference.arguments.push(function({cls, property, argument, param}) {
    var result = inference.parameterTypes.handler({
        cls,
        property,
        name: argument.name || (param && param.name),
        index: _.indexOf(property.paramNames, argument.name || (param && param.name))
    });
    return result;
});

export default inference;
