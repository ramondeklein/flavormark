import {BlockParser, BlockNodeCtor} from "./../../../BlockParser";
import {ThNode} from "./../node/ThNode";

export class ThParser extends BlockParser<ThNode> {
    public parseInlines = true;
    public constructor (nodeCtor : BlockNodeCtor<ThNode> = ThNode) {
        super(nodeCtor);
    }
    public continue () : boolean { return false; }
    public finalize () {}
    public canContain () { return false; }
    public getString (node : ThNode) : string {
        return node.stringContent;
    }
}
