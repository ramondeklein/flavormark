import {Node} from "../Node";
import {BlockParserCollection} from "../BlockParserCollection";

var reNonSpace = /[^ \t\f\v\r\n]/;


var C_TAB = 9;
var C_SPACE = 32;

export var isSpaceOrTab = function(c : number|string) {
    //Temporarily making it accept both
    if (typeof c == "string") {
        return c == " " || c == "\t";
    }
    return c === C_SPACE || c === C_TAB;
};

export var peek = function(ln : string, pos : number) {
    if (pos < ln.length) {
        return ln.charCodeAt(pos);
    } else {
        return -1;
    }
};

// Returns true if block ends with a blank line, descending if needed
// into lists and sublists.
export var endsWithBlankLine = function(blockParsers : BlockParserCollection, block : Node|undefined) {
    while (block) {
        if (block.isLastLineBlank()) {
            return true;
        }
        const p = blockParsers.get(block);
        if (p.endsWithBlankLineIfLastChildEndsWithBlankLine) {
            block = block.getLastChild();
        } else {
            break;
        }
    }
    return false;
};

// Returns true if string contains only space characters.
export var isBlank = function(s : string|undefined) {
    if (s == undefined) {
        throw new Error("s cannot be undefined")
    }
    return !(reNonSpace.test(s));
};
