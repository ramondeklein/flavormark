import {DelimitedInlineSubParser, DelimiterInfo, ParseArgs, ParseResult} from "./../../../DelimitedInlineSubParser";
import {RegexStream} from "./../../../RegexStream";

const C_SINGLEQUOTE = 39;
const C_DOUBLEQUOTE = 34;

export class SmartQuoteParser extends DelimitedInlineSubParser {
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
    public parse (args : ParseArgs, delimiter : number) : ParseResult {
        if (delimiter == C_SINGLEQUOTE) {
            args.closer.node.setString("\u2019");
            if (args.openerFound) {
                args.opener.node.setString("\u2018");
            }
            return {
                closer : args.closer.next,
            };
        } else {
            args.closer.node.setString("\u201D");
            if (args.openerFound) {
                args.opener.node.setString("\u201C");
            }
            return {
                closer : args.closer.next,
            };
        }
    }
}