"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlockParser_1 = require("./../../../BlockParser");
const ThematicBreakNode_1 = require("./../node/ThematicBreakNode");
const reThematicBreak = /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/;
class ThematicBreakParser extends BlockParser_1.BlockParser {
    constructor(nodeCtor = ThematicBreakNode_1.ThematicBreakNode) {
        super(nodeCtor);
        this.acceptsLines = false;
        this.isLeaf = true;
    }
    tryStart(parser) {
        if (parser.indented) {
            return false;
        }
        if (!reThematicBreak.test(parser.currentLine.slice(parser.nextNonspace))) {
            return false;
        }
        parser.closeUnmatchedBlocks();
        parser.addChild(this, parser.nextNonspace);
        parser.advanceOffset(parser.currentLine.length - parser.offset, false);
        return true;
    }
    continue() {
        // a thematic break can never container > 1 line, so fail to match:
        return false;
    }
    ;
    finalize() { }
    canContain() { return false; }
}
exports.ThematicBreakParser = ThematicBreakParser;
//# sourceMappingURL=ThematicBreakParser.js.map