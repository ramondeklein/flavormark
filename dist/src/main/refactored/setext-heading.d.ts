import { BlockParser } from "./BlockParser";
import { Parser } from "../blocks";
import { Node } from "../node";
import { HeadingNode } from "./HeadingNode";
export declare class SetextHeadingParser extends BlockParser<HeadingNode> {
    tryStart: (parser: Parser, container: Node) => boolean;
    continue: () => boolean;
    finalize: () => void;
    canContain: () => boolean;
    acceptsLines: boolean;
    parseInlines: boolean;
    isLeaf: boolean;
    getString(node: HeadingNode): string;
    unsetString(node: HeadingNode): void;
}
export declare const setextHeadingParser: SetextHeadingParser;
