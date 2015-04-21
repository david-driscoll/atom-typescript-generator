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

    provider.paramName()
        .forProperty(property => _.startsWith(property.name, "observeTextEditors"))
        .forName("callback")
        .return("callback");

    provider.paramType()
        .forProperty("observeTextEditors")
        .forName("callback")
        .return("(editor: Atom.TextEditor) => void");

    provider.type()
        .forPropertyName(name => _.any(['insert'], z => _.startsWith(name, z)))
        .return("TextBuffer.Range | boolean");

    provider.type()
        .forPropertyName(name => _.startsWith(name, "tokenizedLines"))
        .return("TokenizedLine[]");

    provider.type()
        .forPropertyName(name => _.startsWith(name, "tokenizedLine"))
        .return("TokenizedLine");

};

//var ignoreAtomProperties: Inference.IgnoreProperty = function({cls, property}) {
//    return cls.project === "atom" && cls.name === "Atom" && _.contains(["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"], property.name);
//}

//var atomType: Inference.TypeName = function({cls, property, type}) { return cls.project === "atom" && cls.name === "AtomApplication" && property.name === "windows" && "AtomWindow[]"; }
