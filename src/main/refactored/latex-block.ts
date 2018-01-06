import {BlockParser} from "../BlockParser";
import {Parser} from "../Parser";
import {Node} from "../Node";
import {peek, isSpaceOrTab} from "./util";
//import {unescapeString} from "../common";
//
import {LatexBlockNode} from "./LatexBlockNode";

var reCodeFence = /^\${2,}(?!.*`)/;

var reClosingCodeFence = /^(?:\${2,})(?= *$)/;

export class LatexBlockParser extends BlockParser<LatexBlockNode> {
    tryStart= (parser : Parser) => {
        var match;
        if (!parser.indented &&
            (match = parser.currentLine.slice(parser.nextNonspace).match(reCodeFence))) {
            var fenceLength = match[0].length;
            parser.closeUnmatchedBlocks();
            var container = parser.addChild<LatexBlockNode>(this, parser.nextNonspace);
            container.fenceLength = fenceLength;
            container.fenceChar = match[0][0];
            container.fenceOffset = parser.indent;
            parser.advanceNextNonspace();
            parser.advanceOffset(fenceLength, false);

            const sameLineEndMatch = parser.currentLine.slice(parser.offset).match(/(\${2,})\s*$/);
            if (sameLineEndMatch != null) {
                if (sameLineEndMatch[1].length == fenceLength) {
                    //End now
                    container.oneLine = true;
                    container.string_content = parser.currentLine.slice(
                        parser.offset,
                        sameLineEndMatch.index
                    );
                    parser.advanceOffset(parser.currentLine.length-parser.offset, false);
                    parser.finalize(container, parser.lineNumber);
                }
            }
            return true;
        } else {
            return false;
        }
    };
    continue= (parser : Parser, container : LatexBlockNode)=>  {
        if (container.oneLine) {
            return false;
        }
        var ln = parser.currentLine;
        var indent = parser.indent;
        var match = (indent <= 3 &&
            ln.charAt(parser.nextNonspace) === container.fenceChar &&
            ln.slice(parser.nextNonspace).match(reClosingCodeFence));
        if (match && match[0].length >= container.fenceLength) {
            // closing fence - we're at end of line, so we can return
            parser.finalize(container, parser.lineNumber);
            return false;
        } else {
            // skip optional spaces of fence offset
            var i = container.fenceOffset;
            if (i == null) {
                throw new Error("i cannot be null")
            }
            while (i > 0 && isSpaceOrTab(peek(ln, parser.offset))) {
                parser.advanceOffset(1, true);
                i--;
            }
        }
        return true;
    };
    finalize= (_parser : Parser, block : LatexBlockNode)=>  {
        let content = block.string_content;
        if (content == null) {
            throw new Error("content cannot be null");
        }
        content = content.replace(/^\$/, "\\$");
        while (/[^\\]\$/.test(content)) {
            content = content.replace(/([^\\])\$/, "$1\\$");
        }

        block.literal = content;
        block.string_content = null; // allow GC
    };
    canContain= () => { return false; };
    acceptsLines = true;
    earlyExitOnEnd = true;
    ignoreLastLineBlank = (_parser : Parser, _container : Node) => { return true; };
    isLeaf = true;
    public appendString (node : LatexBlockNode, str : string) : void {
        if (node.string_content == null) {
            node.string_content = "";
        }
        node.string_content += str;
    }
    public getString (node : LatexBlockNode) : string {
        return node.string_content || "";
    }
    // allow raw string to be garbage collected
    public unsetString (node : LatexBlockNode) : void {
        node.string_content = null;
    }
}

export const latexBlockParser = new LatexBlockParser("latex_block", LatexBlockNode);