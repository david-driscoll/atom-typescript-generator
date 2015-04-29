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

    provider.paramType()
        .forClass("Color")
        .forProperty(x => x.name === "constructor")
        .return("number");

    provider.paramType()
        .forClass("Color")
        .forProperty(x => x.name === "color")
        .return("Color");

    provider.paramType()
        .forClass("Color")
        .forProperty(x => x.name === "clone")
        .return("Color");

    provider.paramType()
        .forClass("CommandRegistry")
        .forProperty(z => z.name === "add")
        .forName("target")
        .return("string | JQuery | Node")

    provider.paramType()
        .forClass("CommandRegistry")
        .forProperty(z => _.any(['add', 'addSelectorBasedListener', 'addInlineListener', 'onWillDispatch'], x => z.name === x))
        .forName("callback")
        .return("(event: Event) => any");

    provider.type()
        .forClass(x => _.any(['InlineListener', 'SelectorBasedListener'], x.name))
        .forPropertyName("callback")
        .return("(event: Event) => any");

    provider.paramName()
        .forClass("CommandRegistry")
        .forProperty(z => z.name == "dispatch")
        .forName(z => z == "detail")
        .compute(function({cls, property, name, index}) { return name + '?'; });

    provider.paramName()
        .order(-500)
        .forClass("CommandRegistry")
        .allParamsRequired();

    provider.paramType()
        .forClass("CommandRegistry")
        .forName("target")
        .return("Node");

    provider.paramType()
        .forClass("CommandRegistry")
        .forProperty(z => _.contains(z.name.toLowerCase(), "snapshot"))
        .forName("snapshot")
        .return("(InlineListener | SelectorBasedListener)[]");

    provider.type()
        .forClass("CommandRegistry")
        .forPropertyName("getSnapshot")
        .return("(InlineListener | SelectorBasedListener)[]");

    provider.type()
        .forClass("CommandRegistry")
        .forPropertyName("handleCommandEvent")
        .return("void");

    provider.paramType()
        .forClass("CommandRegistry")
        .forName(z => z === "originalEvent")
        .return("Event");

    provider.ignore()
        .forClass("CommandRegistry")
        .forProperty(property => _.contains(["addSelectorBasedListener", "addInlineListener", "handleCommandEvent", "commandRegistered"], property.name))
        .return(true);

    provider.ignore()
        .forClass("Config")
        .forProperty(property => !property.doc || (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section")) || _.contains(["undefined", "observe", "onDidChange", "get", "set", "priorityForSource", "emitChangeEvent", "resetUserSettings", "getRawValue", "setRawValue", "observeKeyPath", "onDidChangeKeyPath", "isSubKeyPath", "setRawDefault", "setDefaults", "deepClone", "setScopedDefaultsFromSchema", "extractDefaultsFromSchema", "makeValueConformToSchema", "setRawScopedValue", "getRawScopedValue", "observeScopedKeyPath", "onDidChangeScopedKeyPath"], property.name))
        .return(true);

    provider.paramName()
        .order(-500)
        .forClass("Config")
        .allParamsRequired();

    provider.paramType()
        .forClass("Config")
        .forProperty(z => z.name === "getAll")
        .forName(z => z === "options")
        .return("{ sources: string[]; excludeSources: string[]; scope: ScopeDescriptor }");

    provider.paramType()
        .forClass("Config")
        .forProperty(z => z.name === "unset")
        .forName(z => z === "options")
        .return("{ scopeSelector: string; source: string }");

    provider.paramName()
        .forClass("Config")
        .forProperty(z => z.name === "getAll")
        .forName(z => z === "options")
        .return("options?");

    provider.paramName()
        .forClass("Config")
        .forProperty(z => z.name === "unset")
        .forName(z => z === "options")
        .return("options?");

    provider.type()
        .forClass("Config")
        .forProperty(z => z.name === "getAll")
        .return("{ scopeDescriptor: ScopeDescriptor; value: any }");

    provider.type()
        .forClass("Config")
        .forProperty(z => z.name === "set")
        .return("boolean");

    provider.type()
        .forClass("Config")
        .forProperty(z => z.name === "getSources")
        .return("string[]");

    provider.type()
        .forClass("Config")
        .forProperty(z => z.name === "getSchema")
        .return("{ type: string; default: number; minimum: number; }");

    provider.paramType()
        .forClass("Config")
        .forProperty(z => z.name === "transact")
        .forName(z => z === "callback")
        .return("() => any");

    provider.paramType()
        .forClass('Config')
        .forName("schema")
        .return("{ type: string; default: string; scopes: { [ name: string ]: { type: string; default: string; } } }");

    provider.paramName()
        .forClass('Config')
        .forProperty(z => z.name === "resetSettingsForSchemaChange")
        .forName("source")
        .return("source?");

    provider.paramType()
        .forClass('Config')
        .forName("source")
        .return("string");



    provider.ignore()
        .forClass("ContextMenuManager")
        .forProperty(property => !property.doc || (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section")))
        .return(true);

    provider.paramType()
        .forClass("ContextMenuManager")
        .forName(z => z === "itemsBySelector")
        .return("ContextMenuItem");

    provider.paramName()
        .forClass("ContextMenuManager")
        .forName(z => z === "itemsBySelector")
        .return("itemsBySelector");

    provider.ignore()
        .forClass("Cursor")
        .forProperty(z => _.any(['on', 'changePosition', 'getPixelRect', 'getScreenRange', 'autoscroll', 'getBeginningOfNextParagraphBufferPosition', 'getBeginningOfPreviousParagraphBufferPosition'], x => z.name === x))
        .return(true);

    provider.type()
        .forClass("Cursor")
        .forProperty(z => z.name === "onDidDestroy")
        .forPropertyName("callback")
        .return("() => void");

    provider.type()
        .forClass("Cursor")
        .forPropertyName("callback")
        .return("(event: { oldBufferPosition: TextBuffer.Point; oldScreenPosition: TextBuffer.Point; newBufferPosition: TextBuffer.Point; newScreenPosition: TextBuffer.Point; textChanged: boolean; cursor: Cursor; }) => any");

    provider.paramType()
        .forClass("Cursor")
        .forProperty(z => z.name == "setScreenPosition" || z.name === "setBufferPosition" || z.name === "clearSelection")
        .forName("options")
        .return("{ autoscroll: boolean; }");

    provider.paramType()
        .forClass("Cursor")
        .forProperty(z => {
        return _.any(['isInsideWord', 'getPreviousWordBoundaryBufferPosition', 'getNextWordBoundaryBufferPosition', 'getBeginningOfNextWordBufferPosition', 'getCurrentWordBufferRange'], x => z.name.trim().indexOf(x) > -1)
    })
        .forName(z => {
        console.log(z, z === "options");
        return z.trim() === "options";
    })
        .return("{ wordRegex: RegExp; }");

    provider.paramType()
        .forClass("Cursor")
        .forProperty(z => _.any(['getBeginningOfCurrentWordBufferPosition', 'getEndOfCurrentWordBufferPosition'], x => x === z.name))
        .forName("options")
        .return("{ wordRegex?: RegExp; includeNonWordCharacters?: boolean; allowPrevious?: boolean; }");


    provider.paramType()
        .forClass("Cursor")
        .forProperty(z => _.any(['getCurrentLineBufferRange'], x => z.name === x))
        .forName("options")
        .return("{ includeNewline: boolean; }");

    provider.paramType()
        .forClass("Cursor")
        .forProperty(z => _.any(['wordRegExp'], x => z.name === x))
        .forName("options")
        .return("{ includeNonWordCharacters: boolean; }");
    //getCurrentLineBufferRange

    provider.paramType()
        .forClass("Cursor")
        .forProperty(z => _.startsWith(z.name, 'move'))
        .forName("options")
        .return("{ moveToEndOfSelection: boolean; }");

    provider.type()
        .forClass("Cursor")
        .forProperty(z => z.name === "getCurrentWordPrefix")
        .return("string");

    provider.type()
        .forClass("Cursor")
        .forProperty(z => z.name === "compare")
        .return("number");

    provider.hideClass("ContextMenuItemSet");
    provider.hideClass("CursorsComponent");

    provider.paramType()
        .forClass("Decoration")
        .forProperty("onDidChangeProperties")
        .forName("callback")
        .return("(event: { oldProperties: { type: string; class: string; }; newProperties: { type: string; class: string; }; }) => void");

    provider.paramType()
        .forClass("Decoration")
        .forProperty("onDidDestroy")
        .forName("callback")
        .return("() => void");

    provider.type()
        .forClass("Decoration")
        .forProperty("getProperties")
        .return("{ id:any; type: string; class: string; }");

    provider.paramType()
        .forClass("Decoration")
        .forProperty("setProperties")
        .forName("newProperties")
        .return("{ type: string; class: string; }");

    provider.ignore()
        .forClass("Decoration")
        .forProject(z => _.any(['matchesPattern', 'onDidFlash', 'flash', 'consumeNextFlash']))
        .return(true);

    provider.type()
        .forClass("DefaultDirectoryProvider")
        .return("any");

    provider.paramName()
        .forClass("DeserializerManager")
        .forProperty('add')
        .forName("deserializers")
        .return("deserializers...");

    provider.paramType()
        .forClass("DeserializerManager")
        .forProperty('add')
        .forName("deserializers")
        .return("any[]");

    provider.hideClass("BufferToScreenConversionError");

    provider.paramType()
        .order(-950)
    //.forClass("DisplayBuffer")
        .forProperty(x => _.startsWith(x.name, "onDid"))
        .forName(x => x === "callback" || x === "fn")
        .return("Function /* needs to be defined */");

    provider.type()
        .forClass("GitRepositoryProvider")
        .forProperty(z => _.startsWith(z.name, "repositoryFor"))
        .return("GitRepository");


    provider.ignore()
        .forClass("MenuManager")
        .forProperty(property => !property.doc || (property.doc && (property.doc.visibility === "Private" || property.doc.visibility === "Section")))
        .return(true);

    provider.paramType()
        .forClass("MenuManager")
        .forName(z => z === "items")
        .return("MenuItem");

    provider.hideClass("OverlayManager");
    provider.hideClass("PaneContainerView");
    provider.hideClass("PaneView");
    provider.hideClass("SelectListView");
    provider.hideClass("TextEditorView");
    provider.hideClass("WorkspaceView");

    provider.paramType()
        .forClass("TooltipManager")
        .forName("target")
        .return("HTMLElement");

    provider.paramType()
        .forClass("TooltipManager")
        .forName("options")
        .return("{ animation?: boolean;  html?: boolean; placement?: any; selector?: string; title?: any; trigger?: string; delay?: any; container?: any; keyBindingCommand?: string; keyBindingTarget?: string; }");

    provider.type()
        .forClass("PaneContainer")
        .forProperty("getRoot")
        .return("Pane");

    provider.type()
        .forClass("PaneContainer")
        .forProperty("paneForURI")
        .return("Pane");

    provider.type()
        .forClass("PaneContainer")
        .forProperty("paneForItem")
        .return("Pane");

    provider.paramType()
        .forClass("PaneContainer")
        .forProperty("setRoot")
        .return("Pane");

    provider.paramType()
        .forClass("PaneContainer")
        .forProperty("replaceChild")
        .return("Pane");

    provider.paramType()
        .forClass("PaneContainer")
        .forProperty(x => x.name && _.contains(x.name.toLowerCase(), 'paneitem'))
        .return("(item: any) => void");

    provider.type()
        .forClass("PaneContainer")
        .forProperty(x => x.name && _.contains(x.name.toLowerCase(), 'paneitems'))
        .return("any[]");

    provider.type()
        .forClass("PaneContainer")
        .forProperty(x => x.name && _.contains(x.name.toLowerCase(), 'paneitem'))
        .return("any");

    provider.paramType()
        .forClass("PaneContainer")
        .forProperty(x => x.name && _.contains(x.name.toLowerCase(), 'pane'))
        .return("(pane: Pane) => void");

    provider.type()
        .forClass("PaneContainer")
        .forProperty(x => x.name && _.contains(x.name.toLowerCase(), 'panes'))
        .return("Pane[]");

    provider.type()
        .forClass("PaneContainer")
        .forProperty(x => x.name && _.contains(x.name.toLowerCase(), 'pane'))
        .return("Pane");


    provider.paramName()
        .forClass("PaneContainer")
        .allParamsRequired();

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeTitle")
        .forName("callback")
        .return("(title: string) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangePath")
        .forName("callback")
        .return("(path: string) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChange")
        .forName("callback")
        .return("(item: any) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidStopChanging")
        .forName("callback")
        .return("() => any");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeCursorPosition")
        .forName("callback")
        .return("(event: { oldBufferPosition: TextBuffer.Point; oldScreenPosition: TextBuffer.Point; newBufferPosition: TextBuffer.Point; newScreenPosition: TextBuffer.Point; textChanged: boolean; cursor: Cursor; }) => any");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeSelectionRange")
        .forName("callback")
        .return("(event: { oldBufferRange: TextBuffer.Point; oldScreenRange: TextBuffer.Point; newBufferRange: TextBuffer.Point; newScreenRange: TextBuffer.Point; selection: Selection; }) => any");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeSoftWrapped")
        .forName("callback")
        .return("Function");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeEncoding")
        .forName("callback")
        .return("(encoding: string) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("observeGrammar")
        .forName("callback")
        .return("(grammar: FirstMate.Grammar) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeGrammar")
        .forName("callback")
        .return("(grammar: FirstMate.Grammar) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onWillInsertText")
        .forName("callback")
        .return("(event: { text:string; cancel: Function; }) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidInsertText")
        .forName("callback")
        .return("(event: { text:string; }) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidSave")
        .forName("callback")
        .return("(event: { path:string; }) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangePlaceholderText")
        .forName("callback")
        .return("(text: string) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeCharacterWidths")
        .forName("callback")
        .return("(text: number) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeScrollTop")
        .forName("callback")
        .return("(text: number) => void");

    provider.paramType()
        .forClass("TextEditor")
        .forProperty("onDidChangeScrollLeft")
        .forName("callback")
        .return("(text: number) => void");

    provider.type()
        .order(100)
        //.forClass("TextEditor")
        .forProperty(x => _.startsWith(x.name, "mark"))
        .return("Marker");

    provider.ignore()
        .forClass("Atom")
        .forProperty(z => _.startsWith(z.name, 'deserialize'))
        .return(true);
};
