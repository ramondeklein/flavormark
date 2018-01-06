"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BlockParser {
    constructor(nodeType, nodeCtor) {
        this.continue = () => {
            throw new Error("Not implemented");
        };
        this.lazyContinue = () => {
        };
        this.finalize = () => {
            throw new Error("Not implemented");
        };
        this.canContain = () => {
            throw new Error("Not implemented");
        };
        this.canBeContainedBy = () => {
            return true;
        };
        this.acceptsLines = false;
        this.nodeType = nodeType;
        this.nodeCtor = nodeCtor;
    }
    getNodeType() {
        return this.nodeType;
    }
    getNodeCtor() {
        return this.nodeCtor;
    }
    reinit() { }
    appendString(_node, _str) {
        throw new Error(`appendString() not implemented for ${this.getNodeType()}`);
    } //Only called if acceptsLines is true
    getString(_node) {
        return "";
    }
    // allow raw string to be garbage collected
    unsetString(_node) { }
    setString(_node, _str) {
    }
    isActuallyParagraph() {
        return (this.acceptsLines == true && this.isParagraph == true);
    }
}
exports.BlockParser = BlockParser;
;
//# sourceMappingURL=BlockParser.js.map