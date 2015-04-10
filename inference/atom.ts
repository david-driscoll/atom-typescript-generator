import * as _ from "lodash";

var ignoreAtomProperties : Inference.IgnoreProperty =
    (cls:IClass, property:IProperty) => cls.project === "atom" && cls.name==="Atom" && _.contains(["version", "updateLoadSetting", "workspaceViewParentSelector", "lastUncaughtError"], property.name);

var atomType : Inference.TypeName = (cls, property, type) => cls.project === "atom" && cls.name === "AtomApplication" && property.name === "windows" && "AtomWindow[]";

var result : Inference = {
    ignoreProperties: [ignoreAtomProperties],
    types: [atomType]
}
export default result;
