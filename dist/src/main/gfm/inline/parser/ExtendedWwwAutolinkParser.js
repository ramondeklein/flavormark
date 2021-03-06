"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InlineParser_1 = require("./../../../InlineParser");
const common_1 = require("./../../../commonmark/common");
const LinkNode_1 = require("./../../../commonmark/inline/node/LinkNode");
const common_2 = require("./../../../commonmark/common");
//Trailing punctuation (specifically, ?, !, ., ,, :, *, _, and ~) will not be
//considered part of the autolink, though they may be included in the interior of the link:
const reTrailingPunctuation = new RegExp(/([\?\!\.\,\:\*\_\~]+)$/);
function countChar(str, char) {
    let result = 0;
    for (let c of str) {
        if (c == char) {
            ++result;
        }
    }
    return result;
}
//TODO Separate this out into two classes. One for www, one for scheme
class ExtendedWwwAutolinkParser extends InlineParser_1.InlineParser {
    parse(parser, node) {
        const startpos = parser.pos;
        //There must be at least one period, and no underscores may be present in the last two segments of the domain.
        let domain = parser.match(/^(www\.|(https?|ftp)\:\/\/)[a-zA-Z0-9\_\-]+(\.[a-zA-Z0-9\_\-]+)+/);
        if (domain == undefined) {
            return false;
        }
        const domainSegments = domain.split(".");
        if (/^www\./.test(domain)) {
            domainSegments.shift();
        }
        if (domainSegments.length < 2) {
            throw new Error(`Expected at least 2 domain segments, received ${domainSegments.length}`);
        }
        const lastTwoSegments = domainSegments.slice(domainSegments.length - 2);
        if (lastTwoSegments.some(s => (s.indexOf("_") >= 0))) {
            parser.pos = startpos;
            return false;
        }
        //After a valid domain, zero or more non-space non-< characters may follow:
        let trailing = parser.match(/^[^\s\<]*/);
        if (trailing == undefined) {
            trailing = "";
        }
        else {
            const trailingPunctuation = reTrailingPunctuation.exec(trailing);
            if (trailingPunctuation != undefined) {
                trailing = trailing.substr(0, trailing.length - trailingPunctuation[1].length);
                parser.pos -= trailingPunctuation[1].length;
            }
        }
        /*
            When an autolink ends in ), we scan the entire autolink for the total number of parentheses.
            If there is a greater number of closing parentheses than opening ones, we don’t consider the last
            character part of the autolink, in order to facilitate including an autolink inside a parenthesis:
        */
        if (trailing[trailing.length - 1] == ")") {
            const openCount = countChar(trailing, "(");
            const closeCount = countChar(trailing, ")");
            if (closeCount > openCount) {
                trailing = trailing.substr(0, trailing.length - 1);
                --parser.pos;
            }
        }
        //If an autolink ends in a semicolon (;), we check to see if it appears
        //to resemble an entity reference; if the preceding text is & followed
        //by one or more alphanumeric characters. If so, it is excluded from the autolink:
        if (trailing[trailing.length - 1] == ";") {
            const trailingEntity = /(\&[a-zA-Z0-9]+\;)$/.exec(trailing);
            if (trailingEntity != undefined) {
                trailing = trailing.substr(0, trailing.length - trailingEntity[1].length);
                parser.pos -= trailingEntity[1].length;
            }
        }
        let destinationDomain = domain;
        if (/^www\./.test(destinationDomain)) {
            destinationDomain = "http://" + destinationDomain;
        }
        const link = new LinkNode_1.LinkNode();
        link.destination = common_1.normalizeURI(`${destinationDomain}${trailing}`);
        //node.title = domain;
        link.appendChild(parser.text(common_2.escapeXml(domain + trailing, true)));
        node.appendChild(link);
        return true;
    }
}
exports.ExtendedWwwAutolinkParser = ExtendedWwwAutolinkParser;
//# sourceMappingURL=ExtendedWwwAutolinkParser.js.map