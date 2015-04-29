import * as _ from "lodash";
import {BuilderProvider} from "../_builder";
export default function(provider: BuilderProvider) {
    provider.ignore()
        .forClass("Atom")
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

    provider.type()
        .forPropertyName(name => _.startsWith(name, "tokenizedLine"))
        .return("TokenizedLine");

    provider.type()
        .forPropertyName("createView")
        .return("(model: any) => HTMLElement");

    provider.remapType(true)
        .order(1000)
        .forProperty(z => _.startsWith(z.name, 'add') && _.endsWith(z.name, 'Panel'))
        .forType(name => name === "Object")
        .return("{ item: Node | JQuery | Object; visible?: boolean; priority?: number; }");

    provider.type().forProperty("loadOrCreate").return("Atom");

    provider.paramType().forProperty("pickFolder").forName("callback").return("(path: string) => void");
    provider.paramType().forProperty("onDidBeep").forName("callback").return("() => void");
    provider.paramType().forProperty("onWillThrowError").forName("callback").return("(event: { message: any; url: any; line: any; column: any; originalError: any; }) => void");
    provider.paramType().forProperty("onDidThrowError").forName("callback").return("(event: { message: any; url: any; line: any; column: any; originalError: any; }) => void");

    provider.type()
        .forClass("Atom")
        .forProperty(z => _.any(['close', 'center', 'focus', 'show', 'hide', 'reload', 'maximize', 'toggleFullScreen', 'openDevTools', 'toggleDevTools'], x => x == z.name))
        .return("void");

    provider.type()
        .forClass("Atom")
        .forPropertyName("getSize")
        .return("{ width: number; height: number; }");

    provider.type()
        .forClass("Atom")
        .forPropertyName("getWindowDimensions")
        .return("{ x: number; y: number; width: number; height: number; }");

    provider.paramType()
        .forClass("Atom")
        .forProperty(x => x.name == "setWindowDimensions")
        .return("number");
    provider.paramType()
        .forClass("Atom")
        .forProperty(x => x.name == "isValidDimensions")
        .return("number");

    // ApplicationMenu
    provider.paramType()
        .forClass("ApplicationMenu")
        .forName("template")
        .return("MenuItem[]");
    provider.paramType()
        .forClass("ContextMenu")
        .forName("template")
        .return("MenuItem[]");

    //AtomApplication
    provider.paramType()
        .forClass("AtomApplication")
        .forName("command")
        .return("string");

    provider.paramType()
        .forClass("AtomApplication")
        .forName(name => _.startsWith(name, "window") || _.startsWith(name, "atomWindow"))
        .return("AtomWindow");

        provider.paramType().forName("stdin").return("NodeJS.ReadableStream");
        provider.paramType().forName("stdout").return("NodeJS.WritableStream");
        provider.paramType().forName("stderr").return("NodeJS.WritableStream");
    // ended @ Clipboard
};

//var ignoreAtomProperties: Inference.IgnoreProperty = function({cls, property}) {
//    return cls.project === "atom" && cls.name === "Atom" && _.contains(["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"], property.name);
//}

//var atomType: Inference.TypeName = function({cls, property, type}) { return cls.project === "atom" && cls.name === "AtomApplication" && property.name === "windows" && "AtomWindow[]"; }
