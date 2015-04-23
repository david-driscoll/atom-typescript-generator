import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
import {knownClasses, classes} from "../metadata";
import Project from "../converter/Project";
export default function(provider: BuilderProvider) {
    provider.ignore()
        .order(-1000)
        .return(false);

    provider.ignore()
        .forClass(cls => cls.doc && cls.doc.description && cls.doc.description.toLowerCase().indexOf("deprecated") > -1)
        .return(true);

    provider.ignore()
        .forProperty(property => property.doc && property.doc.description && property.doc.description.toLowerCase().indexOf("deprecated") > -1)
        .return(true);

    function getProperName(name: string) {
        if (_.endsWith(name, 'ies')) {
            return name.replace(/ies$/, 'y');
        } else if (_.endsWith(name, 's')) {
            return name.replace(/s$/, '');
        }
        return name;
    }

    function endsWithS(name: string, clsName: string) {
        if (_.endsWith(name, 'ies')) {
            _.endsWith(getProperName(name).toLowerCase().replace(/ies$/, 'y')
        } else {
            return _.endsWith(name.toLowerCase(), clsName.toLowerCase() + 's')
        }

    }

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(knownClasses, cls => name && _.endsWith(name.toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, type}) {
        var propertyName = property && property.name.toLowerCase();
        var targetClass = _.find(classes, kc => _.endsWith(propertyName, kc.name.toLowerCase()));
        if (!targetClass)
            return null;
        //if (_.any(['Selector', 'Scanner', 'Grammar', 'Config'], z => z === targetClass.name))
        //    return null;
        if (targetClass.project == cls.project)
            return targetClass.name;
        return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}`;
    });

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(knownClasses, cls => name && _.endsWith(getProperName(name).toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, type}) {
        var propertyName = property && property.name.toLowerCase();
        var targetClass = _.find(classes, kc => property.name && _.endsWith(getProperName(propertyName), kc.name.toLowerCase()));
        if (!targetClass)
            return null;
        //if (_.any(['Selector', 'Scanner', 'Grammar', 'Config'], z => z === targetClass.name))
        //    return null;
        if (targetClass.project == cls.project)
            return targetClass.name + '[]';
        return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}[]`;
    });

    provider.paramType()
        .order(-1000)
        .forName(name => _.any(knownClasses, cls => name && _.endsWith(name.toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, name, index}) {
        if (_.endsWith(cls.name, 'View'))
            return null;
        var propertyName = name && name.toLowerCase();
        var targetClass = _.find(classes, kc => _.endsWith(propertyName, kc.name.toLowerCase()));
        if (!targetClass)
            return null;
        //if (_.any(['Selector', 'Scanner', 'Grammar', 'Config'], z => z === targetClass.name))
        //    return null;
        if (targetClass.project == cls.project)
            return targetClass.name;
        return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}`;
    });

    provider.paramType()
        .order(-1000)
        .forName(name => _.any(knownClasses, cls => name && _.endsWith(getProperName(name).toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, name, index}) {
        if (_.endsWith(cls.name, 'View'))
            return null;
        var propertyName = name && name.toLowerCase();
        var targetClass = _.find(classes, kc => property.name && _.endsWith(getProperName(propertyName), kc.name.toLowerCase()));
        if (!targetClass)
            return null;
        //if (_.any(['Selector', 'Scanner', 'Grammar', 'Config'], z => z === targetClass.name))
        //    return null;
        if (targetClass.project == cls.project)
            return targetClass.name + '[]';
        return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}[]`;
    });

    provider.type()
        .order(-1000)
        .forPropertyName(name => name === "getCurrentWindow")
        .return("Atom.AtomWindow");

    provider.type()
        .forPropertyName(name => _.contains(name, "activatePackages"))
        .return("Q.Promise<Package>[]");

    provider.type()
        .forPropertyName(name => _.contains(name, "activatePackage"))
        .return("Q.Promise<Package>");

    provider.type()
        .order(-999)
        .forPropertyName(name => _.any(["deactivate", "activate", "destroy", "reset", "increase", "decrease", "move", "set", "update", "emitDid", 'save', 'undo', 'redo', "delete", "backspace"], z => _.startsWith(name, z)))
        .return("void");

    provider.type()
        .order(-999)
        .forPropertyName(name => _.any(["is", "should", 'use'], z => _.startsWith(name, z)))
        .return("boolean");

    provider.type()
        .order(-999)
        .forPropertyName(name => _.any(["editor"], z => name === z))
        .return("Atom.TextEditor");

    provider.type()
        .order(-999)
        .forPropertyName(name => _.startsWith(name, 'build') && _.endsWith(name.toLowerCase(), 'html'))
        .return("string");

    provider.type()
        .forProperty("copy")
        .compute(function({cls, property, type}) {
        return cls.name;
    });

    provider.type()
        .order(-999)
        .forPropertyName(name => _.any(['onDid', 'observe', 'onWill'], z => _.startsWith(name, z)))
        .return("EventKit.Disposable");

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(['visible', 'mini'], z => _.contains(name.toLowerCase(), z)))
        .return("boolean");

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(['name', 'encoding', 'text', 'text?', 'geturi'], z => _.contains(name.toLowerCase(), z)))
        .return("string");

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(['columns', 'rows'], z => _.endsWith(name.toLowerCase(), z)))
        .return('number[]');

    provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(['column', 'row'], z => _.endsWith(name.toLowerCase(), z)))
        .return('number');

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
