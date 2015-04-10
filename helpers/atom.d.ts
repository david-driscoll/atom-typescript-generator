// Type definitions for Atom (v${version})
// Project: https://atom.io/
// Definitions by: vvakame <https://github.com/vvakame/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// Generated by: https://github.com/david-driscoll/atom-typescript-generator
// Generation tool by david-driscoll <https://github.com/david-driscoll/>
//${refs}

//${content}

// Found @ https://github.com/atom/atom/blob/master/exports/atom.coffee
declare module "atom" {
    var BufferedNodeProcess: typeof Atom.BufferedNodeProcess;
    var BufferedProcess: typeof Atom.BufferedProcess;
    var GitRepository: typeof Atom.GitRepository;
    var Notification: typeof Atom.Notification;
    var TextBuffer: typeof TextBuffer.TextBuffer;
    var Point: typeof TextBuffer.Point;
    var File: typeof Pathwatcher.File;
    var Directory: typeof Pathwatcher.Directory;
    var Emitter: typeof EventKit.Emitter;
    var Disposable: typeof EventKit.Disposable;
    var CompositeDisposable: typeof EventKit.CompositeDisposable;
    var Task: typeof Atom.Task;
    var TextEditor: typeof Atom.TextEditor;
}
declare module "fs-plus" {
    import fs = require("fs");
    export = fs;
}

declare var atom: Atom.Atom;

declare module Atom {
    interface Atom {
        emitter: EventKit.Emitter;
    }
}
