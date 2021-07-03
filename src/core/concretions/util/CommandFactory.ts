import { Command, Message } from "../../abstractions";
import { CommandMetadata } from "../../model";
import { BalanceTeamsCommand, GetPlayerStatsCommand, HelpCommand, LinkPlayerCommand, RecordMatchCommand } from "../commands";
import { CommandMetadataExtractor } from "..";

export class CommandFactory{

    private extractor: CommandMetadataExtractor

    constructor(identifier: string){
        this.extractor = new CommandMetadataExtractor(identifier);
    }

    public tryCreateCommand(message: Message): Command{
        const metadata: CommandMetadata = this.extractor.extract(message);
        switch(metadata.alias){
            case "link":
            case "l":
                return new LinkPlayerCommand(metadata.options);
            case "balance":
            case "b":
                return new BalanceTeamsCommand(metadata.options);
            case "record":
            case "r":
                return new RecordMatchCommand(metadata.options);
            case "stats":
            case "s":
                return new GetPlayerStatsCommand(metadata.options);
            case "help":
            case "h":
                return new HelpCommand(metadata.options);
            default:
                return null;
        }
    }
}