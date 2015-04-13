import * as _ from 'lodash';

import ClassConverted from './Class';

class ProjectConverted implements Converted.IProject {
    public displayName: string;
    public classes: Converted.IClass[];

    constructor(public name: string, classes: IClass[]) {
        this.displayName = ProjectConverted.getProjectDisplayName(name);
        this.classes = classes.map(z => new ClassConverted(this, z));
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
}

export default ProjectConverted;
