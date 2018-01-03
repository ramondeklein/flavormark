import {BlockNode} from "./BlockNode";

export class FencedCodeBlockNode extends BlockNode {
    public fenceLength : number = -1;
    public fenceChar   : string = "";
    public fenceOffset : number = -1;
    public info : string|null = null;
    public string_content : string|null = null;
}
