import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function(provider: BuilderProvider) {
    provider.ignore()
        .forClass("AtomStatic")
        .forProperty(property => _.contains(["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"], property.name))
        .return(true);

    provider.type()
        .forClass("AtomApplication")
        .forProperty("windows")
        .return("AtomWindow[]");

    provider.type()
        .forClass("Project")
        .forProperty("open")
        .return("Q.Promise<TextEditor>")

    provider.type()
        .forClass("Workspace")
        .forProperty("open")
        .return("Q.Promise<TextEditor>")

    provider.type()
        .forProperty(property => _.startsWith("set") || _.startsWith("update"))
        .return("void");

    provider.type()
        .forProperty("copy")
        .compute(function ({cls, property, type}) {
            return cls.name;
        });

    provider.paramType().forName("visible").return("boolean");

    provider.remapType()
        .forProperty(property => _.startsWith(property.name, "get") && _.endsWith(property.name, "TextEditor"))
        .forType(type => type == "any" || type == "Object")
        .return("Atom.TextEditor")

    provider.remapType()
        .forProperty(property => _.startsWith(property.name, "get") && _.endsWith(property.name, "TextEditors"))
        .forType(type => type == "any" || type == "any[]")
        .return("Atom.TextEditor[]")

    provider.paramName()
        .forProperty(property => _.startsWith(property.name, "observeTextEditors"))
        .forName("callback")
        .return("callback");

    provider.paramType()
        .forProperty("observeTextEditors")
        .forName("callback")
        .return("(editor: Atom.TextEditor) => void");
};

//var ignoreAtomProperties: Inference.IgnoreProperty = function({cls, property}) {
//    return cls.project === "atom" && cls.name === "Atom" && _.contains(["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"], property.name);
//}

//var atomType: Inference.TypeName = function({cls, property, type}) { return cls.project === "atom" && cls.name === "AtomApplication" && property.name === "windows" && "AtomWindow[]"; }
