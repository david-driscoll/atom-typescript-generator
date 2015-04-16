import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function (provider: BuilderProvider) {
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
};

//var ignoreAtomProperties: Inference.IgnoreProperty = function({cls, property}) {
//    return cls.project === "atom" && cls.name === "Atom" && _.contains(["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"], property.name);
//}

//var atomType: Inference.TypeName = function({cls, property, type}) { return cls.project === "atom" && cls.name === "AtomApplication" && property.name === "windows" && "AtomWindow[]"; }
