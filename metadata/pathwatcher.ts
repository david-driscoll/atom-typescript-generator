var items = [
    'var watch(path:string, callback?: (event: any, newFilePath: string) ) : PathWatcher.PathWatcher;',
    'var closeAllWatchers() => void;',
    'var getWatchedPaths() => string[];',
    'var File: typeof PathWatcher.File;',
    'var Directory: typeof PathWatcher.Directory;'
];

export default { content: { "pathwatcher.View": items } };
