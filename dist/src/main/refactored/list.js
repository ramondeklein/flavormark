"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlockParser_1 = require("./BlockParser");
const util_1 = require("./util");
const BlockNode_1 = require("./BlockNode");
class ListParser extends BlockParser_1.BlockParser {
    constructor() {
        super(...arguments);
        this.continue = () => { return true; };
        this.finalize = (parser, block) => {
            var item = block.firstChild;
            while (item) {
                // check for non-final list item ending with blank line:
                if (util_1.endsWithBlankLine(parser.getBlockParsers(), item) && item.next) {
                    block.listData.tight = false;
                    break;
                }
                // recurse into children of list item, to see if there are
                // spaces between any of them:
                var subitem = item.firstChild;
                while (subitem) {
                    if (util_1.endsWithBlankLine(parser.getBlockParsers(), subitem) &&
                        (item.next || subitem.next)) {
                        block.listData.tight = false;
                        break;
                    }
                    subitem = subitem.next;
                }
                item = item.next;
            }
        };
        this.canContain = (blockParser) => { return blockParser.isListItem == true; };
        this.acceptsLines = false;
        this.isList = true;
    }
}
exports.ListParser = ListParser;
exports.listParser = new ListParser("list", BlockNode_1.BlockNode);
//# sourceMappingURL=list.js.map