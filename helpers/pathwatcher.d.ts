// Type definitions for pathwatcher (v${version})
// Project: https://github.com/atom/node-pathwatcher
// Definitions by: david-driscoll <https://github.com/david-driscoll/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// Generated by: https://github.com/david-driscoll/atom-typescript-generator
// Generation tool by david-driscoll <https://github.com/david-driscoll/>
//${refs}

// Found @ https://github.com/atom/node-pathwatcher/blob/master/src/main.coffee
declare module "pathwatcher" {
    var watch(path:string, callback?: (event: any, newFilePath: string) ) : PathWatcher.PathWatcher;
    var closeAllWatchers() => void;
    var getWatchedPaths() => string[];
    var File: typeof PathWatcher.File;
    var Directory: typeof PathWatcher.Directory;
}