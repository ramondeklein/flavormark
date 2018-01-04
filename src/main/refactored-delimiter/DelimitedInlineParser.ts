import {RegexStream} from "../refactored-misc/RegexStream";
import {Delimiter, DelimiterCollection} from "../refactored-misc/DelimiterCollection";

export interface DelimiterInfo {
    beforeIsPunctuation : boolean,
    afterIsPunctuation : boolean,
    leftFlanking : boolean,
    rightFlanking : boolean,
}

export interface ParseArgs {
    delimiters : DelimiterCollection;
    openerFound : boolean;
    opener : Delimiter|null;
    closer : Delimiter|null;
}

export abstract class DelimitedInlineParser {
    public abstract getDelimiterCharacterCodes () : number[];
    public abstract advanceDelimiter (stream : RegexStream, delimiter : number) : void;
    public abstract canOpen (info : DelimiterInfo, delimiter : number) : boolean;
    public abstract canClose (info : DelimiterInfo, delimiter : number) : boolean;

    public abstract getDelimiterContent (stream : RegexStream, delimiterStartPosition : number, delimiter : number) : string;
    public abstract tryParse (args : ParseArgs, delimiter : number) : boolean;
}
