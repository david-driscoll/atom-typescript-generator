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

    /*provider.type()
        .order(-1000)
        .forPropertyName(name => _.any(knownClasses, cls => name && _.endsWith(name.toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, type}) {
        var propertyName = property && property.name.toLowerCase();
        var targetClass = _.find(classes, kc => _.endsWith(propertyName, kc.name.toLowerCase()));
        if (!targetClass)
            return null;
        if (_.any(["deactivate", "activate", "destroy", "reset", "increase", "decrease", "move", "set", "update", "emitDid", 'save', 'undo', 'redo', "delete", "backspace"], z => _.startsWith(property.name, z)))
            return null;
        console.log(propertyName);
        //if (_.any(['Selector', 'Scanner', 'Grammar', 'Config'], z => z === targetClass.name))
        //    return null;
        if (targetClass.project == cls.project)
            return targetClass.name;
        return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}`;
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
        if (_.any(["deactivate", "activate", "destroy", "reset", "increase", "decrease", "move", "set", "update", "emitDid", 'save', 'undo', 'redo', "delete", "backspace"], z => _.startsWith(property.name, z)))
            return null;
        //if (_.any(['Selector', 'Scanner', 'Grammar', 'Config'], z => z === targetClass.name))
        //    return null;
        if (targetClass.project == cls.project)
            return targetClass.name;
        return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}`;
    });*/

    provider.type()
        .order(-900)
        .forProperty(property => _.any(knownClasses, cls => property.name && _.endsWith(getProperName(property.name).toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, type}) {

        var propertyName = property && property.name.toLowerCase();

        var targetClass = _.find(classes, kc => property.name && _.endsWith(getProperName(property.name).toLowerCase(), kc.name.toLowerCase()));
        if (!targetClass)
            return null;

        if (targetClass.project == cls.project) {
            if (getProperName(property.name) !== property.name) {
                return targetClass.name + '[]';
            } else {
                return targetClass.name;
            }
        } else {
            if (getProperName(property.name) !== property.name) {
                return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}[]`;
            } else {
                return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}`;
            }
        }
    });

    provider.paramType()
        .order(-900)
        .forName(name => _.any(knownClasses, cls => name && _.endsWith(getProperName(name).toLowerCase(), cls.toLowerCase())))
        .compute(function({cls, property, name, index}) {

        if (_.endsWith(cls.name, 'View'))
            return null;

        var propertyName = name && name.toLowerCase();

        var targetClass = _.find(classes, kc => name && _.endsWith(getProperName(name).toLowerCase(), kc.name.toLowerCase()));
        if (!targetClass)
            return null;

        if (propertyName && propertyName.indexOf("selection") > -1) {
            console.log(propertyName, getProperName(property.name), property.name, getProperName(property.name) !== property.name);
        }

        if (targetClass.project == cls.project) {
            if (getProperName(name) !== name) {
                return targetClass.name + '[]';
            } else {
                return targetClass.name;
            }
        } else {
            if (getProperName(name) !== name) {
                return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}[]`;
            } else {
                return `${Project.getProjectDisplayName(targetClass.project) }.${targetClass.name}`;
            }
        }
    });

    provider.type()
        .forPropertyName(x => _.startsWith(x, "get") && _.endsWith(x, "Path"))
        .return("string");

    provider.type()
        .forPropertyName(x => _.startsWith(x, "get") && _.endsWith(x, "Paths"))
        .return("string[]");


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
        .order(-1000)
        .forProperty(name => _.any(["display", "deactivate", "activate", "destroy", "reset", "increase", "decrease", "move", "set", "update", "emitDid", 'save', 'undo', 'redo', "delete", "backspace", "store", 'start', 'unload', 'remove', 'send', 'add', 'kill', 'open', 'run', "restore", 'minimize', 'focus', 'close', 'reload', 'handle', 'emit', 'clear'], z => _.startsWith(name.name, z)))
        .return("void");

    provider.type()
        .order(-990)
        .forProperty(p => _.any(["is", "should", 'use', "in"], z => _.startsWith(p.name, z)))
        .return("boolean");

    provider.type()
        .order(-990)
        .forProperty(p => _.any(["editor"], z => p.name === z))
        .return("Atom.TextEditor");

    provider.type()
        .order(-990)
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

    provider.paramName()
        .forProperty(p => _.any(['onDid', 'observe', 'onWill'], z => _.startsWith(p.name, z)))
        .forName("callback")
        .return("callback");

    provider.type()
        .order(-990)
        .forPropertyName(name => _.any(['visible', 'mini'], z => _.contains(name.toLowerCase(), z)))
        .return("boolean");

    provider.type()
        .order(-990)
        .forPropertyName(name => _.any(['pid'], z => _.contains(name.toLowerCase(), z)))
        .return("number");

    provider.paramType()
        .forName(name => _.any(['devmode', 'safemode', 'apipreviewmode', 'newwindow', 'exitwhendone', 'logfile'], z => name.toLowerCase() === z.toLowerCase()))
        .return("boolean");

    provider.type()
        .order(-990)
        .forPropertyName(name => _.any(['name', 'encoding', 'text', 'text?', 'geturi', 'url', 'path', 'specdirectory', 'command', 'message'], z => _.contains(name.toLowerCase(), z.toLowerCase())))
        .return("string");

    provider.type()
        .order(-990)
        .forPropertyName(name => _.any(['columns', 'rows', 'lines'], z => _.endsWith(name.toLowerCase(), z)))
        .return('number[]');

    provider.type()
        .order(-990)
        .forPropertyName(name => _.any(['pid', 'version', 'vertical', 'horizontal', 'width', 'height'], z => _.contains(name.toLowerCase(), z)))
        .return('number');

    provider.type()
        .order(-990)
        .forPropertyName(name => _.any(['column', 'row', 'line', 'vertical', 'horizontal', 'width', 'height', 'count', 'length'], z => _.endsWith(name.toLowerCase(), z)))
        .return('number');

    provider.paramName()
        .order(-1000)
        .compute(function({cls, property, name, index}) {
        return ((property.paramNames && property.paramNames[index]) || name) + '?'
    });

    provider.remapType(true)
        .forType(z => z === "void")
        .return("any");

    provider.paramType()
        .forProject(x => x !== "scoped-property-store")
        .forName("selector")
        .return("string");

    provider.type()
        .forProject(x => x !== "scoped-property-store")
        .forProperty(z => z.name === "selector")
        .return("string");

    provider
        .remapType()
        .compute(function({cls, property, type}) {
        if (_.startsWith(property.name, "observe") || _.startsWith(property.name, "onDid")) {
            if (!_.startsWith(type, "Function") && !_.startsWith(type, "(")) {
                var t = type.split('.');
                var name = _.trimRight(t[t.length-1].toLowerCase(), '[]');
                if (name == "package")
                name = "pack";
                return `(${name}: ${type}) => void`;
            }
        }
        return type;
    })


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
