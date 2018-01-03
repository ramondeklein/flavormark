import { BlockParser, BlockParserMeta } from "./BlockParser";
import { Parser } from "../blocks";
import { Node } from "../node";
import { BlockNodeCtor } from "./BlockParser";
import { ListNode } from "./ListNode";
import { ItemNode } from "./ItemNode";
export declare class ItemParser extends BlockParser<ItemNode> {
    private listParser;
    constructor(nodeType: string, nodeCtor: BlockNodeCtor<ItemNode>, listParser: BlockParser<ListNode>);
    tryStart: (parser: Parser, container: Node) => boolean;
    continue: (parser: Parser, container: ItemNode) => boolean;
    finalize: () => void;
    canContain: (blockParser: BlockParserMeta) => boolean;
    acceptsLines: boolean;
    ignoreLastLineBlank: (parser: Parser, container: Node) => boolean;
    isListItem: boolean;
}
export declare const itemParser: ItemParser;
