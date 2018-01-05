import {DelimitedInlineParser, DelimiterInfo, ParseArgs} from "./DelimitedInlineParser";
import {RegexStream} from "../refactored-misc/RegexStream";

var C_SINGLEQUOTE = 39;
var C_DOUBLEQUOTE = 34;

export class SmartQuoteParser extends DelimitedInlineParser {
    public getDelimiterCharacterCodes () : number[] {
        return [
            C_SINGLEQUOTE,
            C_DOUBLEQUOTE
        ];
    }
    public advanceDelimiter (stream : RegexStream) : void {
        ++stream.pos;
    }
    public canOpen (info : DelimiterInfo) : boolean {
        return info.leftFlanking && !info.rightFlanking;
    }
    public canClose (info : DelimiterInfo) : boolean {
        return info.rightFlanking;
    }

    public getDelimiterContent (_stream : RegexStream, _delimiterStartPosition : number, delimiter : number) : string {
        if (delimiter == C_SINGLEQUOTE) {
            return "\u2019";
        } else {
            return "\u201C";
        }
    }
    public tryParse (args : ParseArgs, delimiter : number) : boolean {
        if (args.closer == null) {
            throw new Error("closer cannot be null");
        }
        if (delimiter == C_SINGLEQUOTE) {
            args.closer.node.setString("\u2019");
            if (args.openerFound) {
                if (args.opener == null) {
                    throw new Error("opener cannot be null");
                }
                args.opener.node.setString("\u2018");
            }
            args.closer = args.closer.next;
        } else {
            args.closer.node.setString("\u201D");
            if (args.openerFound) {
                if (args.opener == null) {
                    throw new Error("opener cannot be null");
                }
                args.opener.node.setString("\u201C");
            }
            args.closer = args.closer.next;
        }
        return true;
    }
}