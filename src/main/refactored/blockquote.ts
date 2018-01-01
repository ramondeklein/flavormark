//import {BlockParser} from "./BlockParser";
import {Parser} from "../blocks";
//import {Node} from "../node";
import {peek, isSpaceOrTab} from "./util";

var C_GREATERTHAN = 62;

export const blockquoteParser = {
    tryStart: function(parser : Parser) {
        if (!parser.indented &&
            peek(parser.currentLine, parser.nextNonspace) === C_GREATERTHAN) {
            parser.advanceNextNonspace();
            parser.advanceOffset(1, false);
            // optional following space
            if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
                parser.advanceOffset(1, true);
            }
            parser.closeUnmatchedBlocks();
            parser.addChild('block_quote', parser.nextNonspace);
            return 1;
        } else {
            return 0;
        }
    },
    continue: function(parser : Parser) {
        var ln = parser.currentLine;
        if (!parser.indented &&
            peek(ln, parser.nextNonspace) === C_GREATERTHAN) {
            parser.advanceNextNonspace();
            parser.advanceOffset(1, false);
            if (isSpaceOrTab(peek(ln, parser.offset))) {
                parser.advanceOffset(1, true);
            }
        } else {
            return false;
        }
        return true;
    },
    finalize: function() { return; },
    canContain: function(t:string) { return (t !== 'item'); },
    acceptsLines: false
};
