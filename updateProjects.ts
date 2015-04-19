import {existsSync, unlinkSync} from 'fs'
import {join} from 'path'
import {execSync} from "child_process";

var projectsToDocument = require('./projects.json');

export var projects : string[]  = projectsToDocument.projects.map(z => {
    if (z.indexOf('git@') === 0) {
        return z.match(/git@.*?\/(.*?)\.git/)[1].toLowerCase();
    } else {
        return z;
    }
});
export var doNotTrack : string[] = projectsToDocument.doNotTrack;
export var references : string[] = projectsToDocument.references

projects.forEach((project ,index) => {
    var documentProject = projectsToDocument.projects[index];
    if (existsSync(`../${project}`)) {
        // pull?
        /*console.log(`Pulling ${project}...`)
        execSync(`git pull`, {
            cwd: join(process.cwd(), `../${project}`),
            stdio: 'inherit'
        });
        if (existsSync('./metadata.json')) {
            unlinkSync('./metadata.json');
        }*/
    } else {
        if (documentProject.indexOf('git@') === 0) {
            execSync(`git clone ${documentProject}`, {
                cwd: join(process.cwd(), "../"),
                stdio: 'inherit'
            });
        } else {
            // clone
            execSync(`git clone git@github.com:atom/${documentProject}.git`, {
                cwd: join(process.cwd(), "../"),
                stdio: 'inherit'
            });
        }
        if (existsSync('./metadata.json')) {
            unlinkSync('./metadata.json');
        }
    }
});
