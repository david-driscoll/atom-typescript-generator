import * as _ from "lodash";
import {projectTypeMap} from "./metadata";

export default function getMappedType(cls:IClass, value: string) {
    if (_.startsWith(cls.project, "node-")) {
        var newName = cls.project.replace('node-', '')
        if (projectTypeMap[newName] && projectTypeMap[newName][value]) {
            return projectTypeMap[newName][value];
        }
    }

    if (value === "Grammar") {
        return "FirstMate.Grammar";
    }

    if (value === "Repository")
        return "any"

    if (value === "semver") {
        return "SemVerModule.SemVer";
    }

    if (value === "jQuery") {
        return "JQuery";
    }

    if (value === "Promise") {
        return "Q.Promise<any>";
    }

    if (value === "Bool") {
        return "boolean";
    }

    if (value === "array") {
        return "any[]";
    }

    if (cls.project === "atom" && value === "View") {
        return "SpacePen.View";
    }

    if (value === "Mixto") return '';
    if (value === "Mixin") return '';
    if (value === "Disposable") return 'EventKit.Disposable';

    var result = projectTypeMap[cls.project][value];
    if (result === '.EventEmitter') {
        result = 'NodeJS.EventEmitter'
    }

    if (_.startsWith(value, ':') || _.startsWith(value, '/'))
        return 'any'

    return result || value;
}
