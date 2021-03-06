"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InlineParser_1 = require("./../../../InlineParser");
const normalize_reference_1 = require("./../../normalize-reference");
const link_util_1 = require("./../../link-util");
const LinkNode_1 = require("./../node/LinkNode");
const ImageNode_1 = require("./../node/ImageNode");
var reWhitespaceChar = /^[ \t\n\x0b\x0c\x0d]/;
class CloseBracketParser extends InlineParser_1.InlineParser {
    constructor(delimParser, brackets, refMap) {
        super();
        this.delimParser = delimParser;
        this.brackets = brackets;
        this.refMap = refMap;
    }
    // Try to match close bracket against an opening in the delimiter
    // stack.  Add either a link or image, or a plain [ character,
    // to block's children.  If there is a matching delimiter,
    // remove it from the delimiter stack.
    parse(parser, node) {
        const c = parser.peek();
        if (c != "]") {
            return false;
        }
        var startpos;
        var is_image;
        var dest;
        var title;
        var matched = false;
        var reflabel;
        var opener;
        parser.pos += 1;
        startpos = parser.pos;
        // get last [ or ![
        opener = this.brackets.peek();
        if (opener == undefined) {
            // no matched opener, just return a literal
            node.appendChild(parser.text(']'));
            return true;
        }
        if (!opener.active) {
            // no matched opener, just return a literal
            node.appendChild(parser.text(']'));
            // take opener off brackets stack
            this.brackets.pop();
            return true;
        }
        // If we got here, open is a potential opener
        is_image = opener.image;
        // Check to see if we have a link/image
        var savepos = parser.pos;
        // Inline link?
        if (parser.peek() == "(") {
            parser.pos++;
            if (parser.spnl() &&
                ((dest = link_util_1.parseLinkDestination(parser)) != undefined) &&
                parser.spnl() &&
                // make sure there's a space before the title:
                (reWhitespaceChar.test(parser.subject.charAt(parser.pos - 1)) &&
                    (title = link_util_1.parseLinkTitle(parser)) || true) &&
                parser.spnl() &&
                parser.peek() == ")") {
                parser.pos += 1;
                matched = true;
            }
            else {
                parser.pos = savepos;
            }
        }
        if (!matched) {
            // Next, see if there's a link label
            var beforelabel = parser.pos;
            var n = link_util_1.parseLinkLabel(parser);
            if (n > 2) {
                reflabel = parser.subject.slice(beforelabel, beforelabel + n);
            }
            else if (!opener.bracketAfter) {
                // Empty or missing second label means to use the first label as the reference.
                // The reference must not contain a bracket. If we know there's a bracket, we don't even bother checking it.
                reflabel = parser.subject.slice(opener.index, startpos);
            }
            if (n === 0) {
                // If shortcut reference link, rewind before spaces we skipped.
                parser.pos = savepos;
            }
            if (reflabel) {
                // lookup rawlabel in refmap
                var link = this.refMap[normalize_reference_1.normalizeReference(reflabel)];
                if (link) {
                    dest = link.destination;
                    title = link.title;
                    matched = true;
                }
            }
        }
        if (matched) {
            var imageOrLink = is_image ?
                new ImageNode_1.ImageNode() :
                new LinkNode_1.LinkNode();
            imageOrLink.destination = dest || "";
            imageOrLink.title = title || '';
            var tmp, next;
            tmp = opener.node.getNext();
            while (tmp) {
                next = tmp.getNext();
                tmp.unlink();
                imageOrLink.appendChild(tmp);
                tmp = next;
            }
            node.appendChild(imageOrLink);
            this.delimParser.processEmphasis(opener.previousDelimiter);
            this.brackets.pop();
            opener.node.unlink();
            // We remove this bracket and processEmphasis will remove later delimiters.
            // Now, for a link, we also deactivate earlier link openers.
            // (no links in links)
            if (!is_image) {
                opener = this.brackets.peek();
                while (opener != undefined) {
                    if (!opener.image) {
                        opener.active = false; // deactivate this opener
                    }
                    opener = opener.previous;
                }
            }
            return true;
        }
        else {
            this.brackets.pop(); // remove this opener from stack
            parser.pos = startpos;
            node.appendChild(parser.text(']'));
            return true;
        }
    }
}
exports.CloseBracketParser = CloseBracketParser;
//# sourceMappingURL=CloseBracketParser.js.map