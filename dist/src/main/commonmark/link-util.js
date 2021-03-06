"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const normalize_reference_1 = require("./normalize-reference");
const RegexStream_1 = require("../RegexStream");
const ESCAPED_CHAR = '\\\\' + common_1.ESCAPABLE;
const reSpaceAtEndOfLine = /^ *(?:\n|$)/;
const reLinkTitle = new RegExp('^(?:"(' + ESCAPED_CHAR + '|[^"\\x00])*"' +
    '|' +
    '\'(' + ESCAPED_CHAR + '|[^\'\\x00])*\'' +
    '|' +
    '\\((' + ESCAPED_CHAR + '|[^)\\x00])*\\))');
const reLinkDestinationBraces = new RegExp('^(?:[<](?:[^ <>\\t\\n\\\\\\x00]' + '|' + ESCAPED_CHAR + '|' + '\\\\)*[>])');
const reWhitespaceChar = /^[ \t\n\x0b\x0c\x0d]/;
const reLinkLabel = new RegExp('^\\[(?:[^\\\\\\[\\]]|' + ESCAPED_CHAR +
    '|\\\\){0,1000}\\]');
// Attempt to parse link title (sans quotes), returning the string
// or undefined if no match.
function parseLinkTitle(parser) {
    const title = parser.match(reLinkTitle);
    if (title == undefined) {
        return undefined;
    }
    else {
        // chop off quotes from title and unescape:
        return common_1.unescapeString(title.substr(1, title.length - 2));
    }
}
exports.parseLinkTitle = parseLinkTitle;
// Attempt to parse link destination, returning the string or
// undefined if no match.
function parseLinkDestination(parser) {
    let res = parser.match(reLinkDestinationBraces);
    if (res == undefined) {
        // TODO handrolled parser; res should be undefined or the string
        const savepos = parser.pos;
        let openparens = 0;
        let c;
        while ((c = parser.peek()) != undefined) {
            if (c == "\\") {
                parser.pos += 1;
                if (parser.peek() != undefined) {
                    parser.pos += 1;
                }
            }
            else if (c == "(") {
                parser.pos += 1;
                openparens += 1;
            }
            else if (c == ")") {
                if (openparens < 1) {
                    break;
                }
                else {
                    parser.pos += 1;
                    openparens -= 1;
                }
            }
            else if (reWhitespaceChar.exec(c) != undefined) {
                break;
            }
            else {
                parser.pos += 1;
            }
        }
        res = parser.subject.substr(savepos, parser.pos - savepos);
        return common_1.normalizeURI(common_1.unescapeString(res));
    }
    else {
        return common_1.normalizeURI(common_1.unescapeString(res.substr(1, res.length - 2)));
    }
}
exports.parseLinkDestination = parseLinkDestination;
;
// Attempt to parse a link label, returning number of characters parsed.
function parseLinkLabel(parser) {
    const m = parser.match(reLinkLabel);
    // Note:  our regex will allow something of form [..\];
    // we disallow it here rather than using lookahead in the regex:
    if (m == undefined || m.length > 1001 || /[^\\]\\\]$/.exec(m)) {
        return 0;
    }
    else {
        return m.length;
    }
}
exports.parseLinkLabel = parseLinkLabel;
;
// Attempt to parse a link reference, modifying refmap.
function parseReference(s, refmap) {
    const parser = new RegexStream_1.RegexStream(s);
    const startpos = parser.pos;
    // label:
    const matchChars = parseLinkLabel(parser);
    if (matchChars === 0) {
        return 0;
    }
    const rawlabel = parser.subject.substr(0, matchChars);
    // colon:
    if (parser.peek() == ":") {
        parser.pos++;
    }
    else {
        parser.pos = startpos;
        return 0;
    }
    //  link url
    parser.spnl();
    const dest = parseLinkDestination(parser);
    if (dest == undefined || dest.length === 0) {
        parser.pos = startpos;
        return 0;
    }
    const beforetitle = parser.pos;
    parser.spnl();
    let title = parseLinkTitle(parser);
    if (title == undefined) {
        title = '';
        // rewind before spaces
        parser.pos = beforetitle;
    }
    // make sure we're at line end:
    let atLineEnd = true;
    if (parser.match(reSpaceAtEndOfLine) == undefined) {
        if (title === '') {
            atLineEnd = false;
        }
        else {
            // the potential title we found is not at the line end,
            // but it could still be a legal link reference if we
            // discard the title
            title = '';
            // rewind before spaces
            parser.pos = beforetitle;
            // and instead check if the link URL is at the line end
            atLineEnd = parser.match(reSpaceAtEndOfLine) != undefined;
        }
    }
    if (!atLineEnd) {
        parser.pos = startpos;
        return 0;
    }
    const normlabel = normalize_reference_1.normalizeReference(rawlabel);
    if (normlabel === '') {
        // label must contain non-whitespace characters
        parser.pos = startpos;
        return 0;
    }
    if (!refmap[normlabel]) {
        refmap[normlabel] = { destination: dest, title: title };
    }
    return parser.pos - startpos;
}
exports.parseReference = parseReference;
;
//# sourceMappingURL=link-util.js.map