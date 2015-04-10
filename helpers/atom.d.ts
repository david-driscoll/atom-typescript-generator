//declare module "atom" {
//    export = Atom.AtomStatic
//}

declare var atom: Atom.Atom;

declare module Atom {
    interface Atom {
        emitter: EventKit.Emitter;
    }
}
