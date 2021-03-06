import { BlockParser, BlockNodeCtor } from "./../../../BlockParser";
import { Parser } from "./../../../Parser";
import { HeadingNode } from "./../node/HeadingNode";
export declare class AtxHeadingParser extends BlockParser<HeadingNode> {
    acceptsLines: boolean;
    parseInlines: boolean;
    isLeaf: boolean;
    constructor(nodeCtor?: BlockNodeCtor<HeadingNode>);
    tryStart(parser: Parser): boolean;
    continue(): boolean;
    finalize(): void;
    canContain(): boolean;
    getString(node: HeadingNode): string;
}
