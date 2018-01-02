import { Parser } from "../blocks";
import { BlockNode } from "./BlockNode";
export declare type BlockNodeCtor<NodeT extends BlockNode> = {
    new (nodeType: string, sourcepos: [[number, number], [number, number]]): NodeT;
};
export interface BlockParserMeta {
    canContain: (blockParser: BlockParserMeta) => boolean;
    acceptsLines: boolean;
    earlyExitOnEnd?: boolean;
    parseInlines?: boolean;
    acceptLazyContinuation?: boolean;
    isLeaf?: boolean;
    isParagraph?: boolean;
    isList?: boolean;
    isListItem?: boolean;
}
export declare abstract class BlockParser<NodeT extends BlockNode = BlockNode> implements BlockParserMeta {
    private readonly nodeType;
    private readonly nodeCtor;
    constructor(nodeType: string, nodeCtor: BlockNodeCtor<NodeT>);
    getNodeType(): string;
    getNodeCtor(): BlockNodeCtor<NodeT>;
    reinit(): void;
    tryStart?: (parser: Parser, container: BlockNode) => boolean;
    continue: (parser: Parser, block: NodeT) => boolean;
    finalize: (parser: Parser, block: NodeT) => void;
    ignoreLastLineBlank?: ((parser: Parser, container: NodeT) => boolean);
    finalizeAtLine?: (parser: Parser, container: NodeT) => boolean;
    appendString(_node: NodeT, _str: string): void;
    getString(_node: NodeT): string;
    unsetString(_node: NodeT): void;
    canContain: (blockParser: BlockParserMeta) => boolean;
    acceptsLines: boolean;
    earlyExitOnEnd?: boolean;
    parseInlines?: boolean;
    acceptLazyContinuation?: boolean;
    isLeaf?: boolean;
    isParagraph?: boolean;
    isList?: boolean;
    isListItem?: boolean;
}