import { BlockParser, BlockNodeCtor } from "./../../../BlockParser";
import { TbodyNode } from "./../node/TbodyNode";
export declare class TbodyParser extends BlockParser<TbodyNode> {
    constructor(nodeCtor?: BlockNodeCtor<TbodyNode>);
    continue(): boolean;
    finalize(): void;
    canContain(): boolean;
}
