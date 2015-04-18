var items = [
    'function watch(path:string, callback?: (event: any, newFilePath: string) => void ) : any;',
    'function closeAllWatchers() : void;',
    'function getWatchedPaths() : string[];'
];

export default { moduleContent: { "node-pathwatcher": items } };
