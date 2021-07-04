import { Message } from "../../../abstractions";
import { CommandMetadata } from "./CommandMetadata";

export class CommandMetadataExtractor{
    constructor(
        private readonly identifier: string
    ){}

    public extract(message: Message): CommandMetadata{
        const tokens: string[] = this.getTokens(message.getContent());
        if(tokens[0].startsWith(this.identifier)){
            const alias: string = tokens[0].slice(1, tokens[0].length - 1);
            const options: string[] = tokens.splice(0, 1);
            return { alias, options };
        }
        return { alias: "", options: []};
    }

    private getTokens(content: string): string[]{
        let tokens: string[] = content.split(" ");
        return tokens.map(token => token.trim());
    }
}