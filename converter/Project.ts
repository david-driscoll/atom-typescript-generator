import * as _ from 'lodash';

import ClassConverted from './Class';
import {references, projects, doNotTrack} from "../updateProjects";
import {projectMap} from "../metadata";

function getNodeName(project: string) {
    if (_.startsWith(project, "node-")) {
        project = project.replace("node-", "");
    }

    return project;
}

class ProjectConverted implements Converted.IProject {
    public displayName: string;
    public classes: Converted.IClass[];
    public nodeName: string;
    public references: string[];
    public notTracking: string[];
    public package: { name:string; version:string; };

    constructor(public name: string, classes: IClass[]) {
        this.displayName = ProjectConverted.getProjectDisplayName(name);
        this.classes = classes.map(z => new ClassConverted(this, z));
        var projectReferences = _.intersection(projectMap[this.name], references);
        this.notTracking = _.difference(projectMap[this.name], projects, doNotTrack, projectReferences).filter(z => !!z);
        this.references = _.unique(_.intersection(projectMap[this.name], projects).concat(projectReferences).filter(z => !!z));
        this.package = require(`../../${name}/package.json`);
        this.nodeName = this.package.name || getNodeName(name);
    }

    public static getProjectDisplayName(project: string) {
        if (_.startsWith(project, "node-")) {
            project = project.replace("node-", "");
        }

        if (project === "semver") {
            return "SemVerModule";
        }

        return _.capitalize(_.camelCase(project));
    }

    public emit({indent}: { indent: number }) {
        var lines = [];

        _.each(this.references, ref => lines.push(`/// <reference path="../${getNodeName(ref) }/${getNodeName(ref) }.d.ts" />`))

        lines.push(`declare module ${this.displayName} {`)
        _.map(this.classes, cls => cls.emit({ indent: indent + 4 })).forEach(str => {
            lines.push(str.substring(indent));
            lines.push('');
        });
        lines.push(`}`)

        return lines.map(z => _.repeat(' ', indent) + z).join('\n');
    }
}

export default ProjectConverted;
