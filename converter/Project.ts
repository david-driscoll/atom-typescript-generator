import * as _ from 'lodash';

import ClassConverted from './Class';
import {references, projects, doNotTrack} from "../updateProjects";
import {projectMap, exported, moduleContent, classes} from "../metadata";

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
    public references: Converted.IImport[];
    public notTracking: string[];
    public package: { name: string; version: string; };
    public exports: Converted.IExport[];

    constructor(public name: string, classes: IClass[]) {
        this.displayName = ProjectConverted.getProjectDisplayName(name);
        this.classes = classes.map(z => new ClassConverted(this, z));
        var projectReferences = _.intersection(projectMap[this.name], references);
        this.notTracking = _.difference(projectMap[this.name], projects, doNotTrack, projectReferences).filter(z => !!z);
        this.references = _.unique(_.intersection(projectMap[this.name], projects)
            .concat(projectReferences)
            .filter(z => !!z)
            ).map(ref => ({
            project: ref,
            projectName: ProjectConverted.getProjectDisplayName(ref),
            projectNodeName: getNodeName(ref)
        }));
        this.package = require(`../../${name}/package.json`);
        this.nodeName = this.package.name || getNodeName(name);

        var _exports = _.find(exported, x => x.project === name);
        if (_exports) {
            this.exports = _exports.values.map(exp => {
                if (exp.indexOf(".") > -1) {
                    var projectName = exp.split('.')[0];
                    var imp = _.find(this.references, x => x.projectName === projectName);
                    if (imp) {
                        return {
                            project: imp.project,
                            projectName: imp.projectName,
                            name: exp.split('.')[1]
                        }
                    }
                }

                return { name: exp };
            });
            //console.log("_exports", this.exports);
            this.classes.forEach(cls => {
                if (_.any(this.exports, exp => cls.name === exp.name)) {
                    //console.log(cls.name);
                    if (cls.name !== this.displayName) {
                        cls.export = true;
                        this.exports = this.exports.filter(z => z.name !== cls.name);
                    }
                }
            });
        }
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

        console.log(this.displayName)
        var lines = [];

        _.each(this.references, ref => lines.push(`/// <reference path="../${ref.projectNodeName }/${ref.projectNodeName }.d.ts" />`))

        lines.push(`declare module ${this.displayName} {`)
        _.map(this.classes, cls => cls.emit({ indent: indent + 4 })).forEach(str => {
            lines.push(str.substring(indent));
            lines.push('');
        });
        lines.push(`}`)
        if (this.exports.length || (moduleContent[this.name] && moduleContent[this.name].length) || this.classes.filter(x => x.export).length) {
            lines.push(`declare module "${this.nodeName}" {`);
            /*this.references.forEach(ref => {
                var exp = '';
                if (_.any(this.exports, exp => ref.projectName === exp.name)) {
                    exp = 'export ';
                }
                lines.push(_.repeat(' ', indent + 4) + `${exp}import ${ref.projectName } = require("${ref.projectNodeName}");`);
            });
            lines.push('');*/

            if (this.classes.filter(x => x.export).length === 1) {
                lines.push(_.repeat(' ', indent + 4) + `export = ${this.displayName}.${this.classes[0].name};`)
            } else {
                this.classes.filter(x => x.export).forEach(x => {
                    var name = x.name;
                    if (name === this.displayName) {
                        name = '_' + this.displayName;
                    }

                    lines.push(_.repeat(' ', indent + 4) + `class ${name} extends ${this.displayName}.${x.name} {}`);
                });
            }

            _.map(this.exports, exp => {
                // special cases
                if (_.contains(exp.name, 'jQuery') || _.contains(exp.name, '$'))
                    return '';

                var name = exp.name;
                if (name === this.displayName) {
                    name = '_' + this.displayName;
                }

                var item = _.repeat(' ', indent + 4);
                if (exp.project) {
                    return `${item}var ${exp.name} : typeof ${exp.projectName}.${exp.name};`;
                } else {
                    var cls = _.find(classes, x => x.name === exp.name);

                    if (cls && ProjectConverted.getProjectDisplayName(cls.project) !== exp.name && !_.any(this.references, imp => imp.projectName === cls.name)) {
                        return `${item}class ${exp.name} extends ${ProjectConverted.getProjectDisplayName(cls.project) }.${exp.name} {}`;
                    } else {
                        //return `${item}export var ${exp.name} : typeof ${this.displayName}.${exp.name};`;
                    }
                }
            })
                .filter(z => !!z)
                .forEach(str => {
                lines.push(str);
            });
            if (moduleContent[this.name]) {
                lines.push(..._.map(moduleContent[this.name], x => _.repeat(' ', indent + 4) + x));
            }
            lines.push(`}`);
        }

        return lines.map(z => _.repeat(' ', indent) + z).join('\n');
    }
}

export default ProjectConverted;
