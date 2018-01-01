import {Parser} from "../blocks";
import {Node} from "../node";

export interface BlockParser {
    tryStart?: (parser : Parser, container : Node) => boolean,
    continue: (parser : Parser, block : Node) => boolean,
    finalize: (parser : Parser, block : Node) => void,
    canContain: (t:string) => boolean,
    acceptsLines: boolean,
    earlyExitOnEnd? : boolean,
    ignoreLastLineBlank? : ((parser : Parser, container : Node) => boolean),
    parseInlines? : boolean,
    finalizeAtLine? : (parser : Parser, container : Node) => boolean,
    acceptLazyContinuation? : boolean, //This has no effect unless acceptsLines is true
    isLeaf? : boolean,
    isParagraph? : boolean, //Has no effect unless acceptsLines is true
};
