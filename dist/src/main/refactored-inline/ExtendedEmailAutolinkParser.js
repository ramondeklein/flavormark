"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InParser_1 = require("./InParser");
const common_1 = require("../common");
const LinkNode_1 = require("./LinkNode");
const common_2 = require("../common");
class ExtendedEmailAutolinkParser extends InParser_1.InParser {
    parse(parser, block) {
        const startpos = parser.pos;
        //There must be at least one period, and no underscores may be present in the last two segments of the domain.
        let email = parser.match(/^[a-zA-Z0-9\.\-\_\+]+\@[a-zA-Z0-9\.\-\_]+/);
        if (email == null) {
            return false;
        }
        let lastChar = email[email.length - 1];
        if (lastChar == ".") {
            email = email.substr(0, email.length - 1);
            --parser.pos;
            lastChar = email[email.length - 1];
        }
        if (lastChar == "-" || lastChar == "_") {
            parser.pos = startpos;
            return false;
        }
        const parts = email.split("@");
        if (parts.length != 2) {
            throw new Error(`Expected exactly 2 parts, received ${parts.length}`);
        }
        //While the GFM spec is pretty permissive, the actual Github implementation is more restrictive
        let domainPart = parts[1];
        if (domainPart.indexOf(".") < 0) {
            parser.pos = startpos;
            return false;
        }
        const node = new LinkNode_1.LinkNode('link');
        node.destination = common_1.normalizeURI(`mailto:${email}`);
        //node.title = domain;
        node.appendChild(parser.text(common_2.escapeXml(email, true)));
        block.appendChild(node);
        return true;
    }
}
exports.ExtendedEmailAutolinkParser = ExtendedEmailAutolinkParser;
//# sourceMappingURL=ExtendedEmailAutolinkParser.js.map