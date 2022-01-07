import { BotError, ErrorCode } from "../..";
import { CommandMetadata } from "./CommandMetadata";

export class CommandMetadataExtractor{

    private static readonly QUOTES_REGEX: RegExp = /['"]/g;
    private static readonly SPACE_REGEX: RegExp = /\s/g;

    constructor(
        private readonly identifier: string
    ){}

    public extract(text: string): CommandMetadata{
        const tokens: string[] = this.getTokens(text);
        if(tokens[0].startsWith(this.identifier)){
            const alias: string = tokens[0].slice(1);
            const options: string[] = tokens.slice(1);
            return { alias, options };
        }
        return { alias: "", options: []};
    }

    private getTokens(text: string): string[]{
        this.validateQuotationMarks(text);
        const tokens: string[] = [];
        const preliminaryTokens: string[] = text.split(CommandMetadataExtractor.QUOTES_REGEX);
        for(let i = 0; i < preliminaryTokens.length; i++){
            if(i % 2 == 0)
                tokens.push(...preliminaryTokens[i].split(CommandMetadataExtractor.SPACE_REGEX))
            else
                tokens.push(preliminaryTokens[i]);
        }
        return tokens.filter(token => token !== '');
    }

    private validateQuotationMarks(text: string): void{
        const appearances: number = text.match(CommandMetadataExtractor.QUOTES_REGEX)?.length || 0;
        if(appearances % 2 != 0)
            throw new BotError(ErrorCode.COMMAND_QUOTE_NOT_MATCHED);
    }
}