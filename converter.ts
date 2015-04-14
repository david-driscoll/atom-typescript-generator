import * as fs from 'fs'
import * as _ from 'lodash';

import {projects, doNotTrack, references} from './updateProjects';
import inference from './inference';
import {classes} from './metadata';
import ProjectConverted from './converter/Project';

export default class Converter {
    private _projects: Converted.IProject[];

    constructor() {
        this._projects = this._extractProjects();
    }

    private _extractProjects() {
        return _(classes).chain()
            .groupBy(z => z.project)
            .map((classes : IClass[], project) => new ProjectConverted(project, classes))
            .value();
    }

    public writeFiles() {
        _.each(this._projects, x => this.writeProject(x));
    }

    public writeProject(project: Converted.IProject) {
        if (project.notTracking.length)
            console.log(`${project.name} not tracking: ${project.notTracking}`);
        if (fs.existsSync(`./helpers/${project.nodeName }.d.ts`)) {
            var content = fs.readFileSync(`./helpers/${project.nodeName }.d.ts`).toString('utf-8');

            content = content.replace("${version}", project.package.version)
                .replace(/\$\{name\}/g, project.name)
                .replace('//${refs}', project.emit({indent:0}));
        } else {
            throw new Error('please create reference helper for ' + project.name);
        }

        if (!fs.existsSync(`./generated/`))
            fs.mkdirSync(`./generated/`);
        if (!fs.existsSync(`./generated/${project.nodeName}/`))
            fs.mkdirSync(`./generated/${project.nodeName}/`);
        fs.writeFileSync(`./generated/${project.nodeName}/${project.nodeName}.d.ts`, content);
    }
}
