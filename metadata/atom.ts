export default  {
    content: { "atom.Atom": ['emitter: EventKit.Emitter;'] },
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
