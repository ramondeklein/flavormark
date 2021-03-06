"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InlineParser_1 = require("./../../../InlineParser");
class ImageStartParser extends InlineParser_1.InlineParser {
    constructor(brackets) {
        super();
        this.brackets = brackets;
    }
    parse(parser, node) {
        const c = parser.peek();
        if (c != "!") {
            return false;
        }
        const startpos = parser.pos;
        ++parser.pos;
        if (parser.peek() != "[") {
            --parser.pos;
            return false;
        }
        ++parser.pos;
        const text = parser.text('![');
        node.appendChild(text);
        // Add entry to stack for this opener
        this.brackets.push(text, startpos + 1, true);
        return true;
    }
}
exports.ImageStartParser = ImageStartParser;
//# sourceMappingURL=ImageStartParser.js.map