import {existsSync, unlinkSync} from 'fs'
import {join} from 'path'
import {execSync} from "child_process";

var projectsToDocument = require('./projects.json');

export var projects : string[]  = projectsToDocument.projects;
export var doNotTrack : string[] = projectsToDocument.doNotTrack;
export var references : string[] = projectsToDocument.references;

projectsToDocument.projects.forEach(project => {
    if (existsSync(`../${project}`)) {
        // pull?
        /*console.log(`Pulling ${project}...`)
        execSync(`git pull`, {
            cwd: join(process.cwd(), `../${project}`),
            stdio: 'inherit'
        });*/
    } else {
        // clone
        execSync(`git clone git@github.com:atom/${project}.git`, {
            cwd: join(process.cwd(), "../"),
            stdio: 'inherit'
        });
        if (existsSync('./metadata.json')) {
            unlinkSync('./metadata.json');
        }
    }
});
