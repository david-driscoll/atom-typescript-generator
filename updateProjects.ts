import {existsSync} from 'fs'
import {join} from 'path'
import {execSync} from "child_process";

var projectsToDocument: string[] = require('./projects.json').projects;
projectsToDocument.forEach(project => {
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
    }
});
