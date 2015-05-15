export default  {
    content: {
        "atom.Atom": ['emitter: EventKit.Emitter;'],
        "atom.TextEditor": ['active: boolean;'],
        "atom.CommandRegistry": [
            'add(target : string | JQuery | Node, commands: { [commandName: string]: (event: Event) => void }): EventKit.Disposable'
        ],
        "atom.Config": [
            'observe(keyPath: string, callback: (value: any) => void): EventKit.Disposable',
            'observe(keyPath: string, options: { scopeDescriptor: ScopeDescriptor }, callback: (value: any) => void): EventKit.Disposable',
            'onDidChange(callback: (item: { keyPath: string; oldValue: any; newValue: any; }) => void): EventKit.Disposable',
            'onDidChange(keyPath: string, callback: (item: { keyPath: string; oldValue: any; newValue: any;}) => void): EventKit.Disposable',
            'onDidChange(keyPath: string, options: { scopeDescriptor: ScopeDescriptor }, callback: (item: { keyPath: string; oldValue: any; newValue: any; }) => void): EventKit.Disposable',
            'get<T>(keyPath: string, options?: { sources: string[]; excludeSources: string[]; scope: ScopeDescriptor }): T',
            'set(keyPath: string, value: any, options?: { scopeSelector: string; source: string })',
        ],
    },
    moduleContent: {
        "Atom": [
            'interface MenuItem { label:string; accelerator?:string; metadata?: any, submenu?: MenuItem[], click?: () => void }',
            'interface ContextMenuItem { label?:string; command?:string; submenu: ContextMenuItem[]; type: string; created: (event: Event) => void; shouldDisplay: (event: Event) => void; }',
        ]
    },
    imports: {
        "atom": ['node-pathwatcher']
    },
    exported: {
        "atom": [
            'Atom', // exported for interface purposes
            'BufferedNodeProcess',
            'BufferedProcess',
            'GitRepository',
            'Notification',
            'TextBuffer',
            'TextBuffer.Point',
            'TextBuffer.Range',
            'Pathwatcher.File',
            'Pathwatcher.Directory',
            'EventKit.Emitter',
            'EventKit.Disposable',
            'EventKit.CompositeDisposable',
        ]
    }
};
