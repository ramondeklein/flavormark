import {HtmlSubRenderer} from "../../../render/html/HtmlSubRenderer";
import {HtmlBuilder} from "../../../render/html/HtmlBuilder";
import {HtmlBlockNode} from "../../HtmlBlockNode";

export class HtmlBlockHtmlRenderer extends HtmlSubRenderer<HtmlBlockNode> {
    public constructor () {
        super(HtmlBlockNode);
    }
    public render (builder : HtmlBuilder, node : HtmlBlockNode, entering : boolean) : void {
        if (entering) {
            builder
                .nl()
                .append(node.literal)
                .nl();
        }
    }
}