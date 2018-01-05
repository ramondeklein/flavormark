import {InParser} from "./InParser";
import {InlineParser} from "../InlineParser";
import {Node} from "../node";
//import {Node} from "./Node";
import {ENTITY} from "../common";

import {decodeHTML} from "entities";

var C_AMPERSAND = 38;

var reEntityHere = new RegExp('^' + ENTITY, 'i');

export class EntityParser extends InParser {
    // Attempt to parse an entity.
    public parse (parser : InlineParser, block : Node) : boolean {
        const c = parser.peek();
        if (c != C_AMPERSAND) {
            return false;
        }

        var m;
        if ((m = parser.match(reEntityHere))) {
            block.appendChild(parser.text(decodeHTML(m)));
            return true;
        } else {
            return false;
        }
    }
}
