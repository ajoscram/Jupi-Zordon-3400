import { Command, CommandFactory, Message } from "../../../abstractions";
import { BalanceTeamsCommand, GetPlayerStatsCommand, HelpCommand, LinkAccountCommand, RecordMatchCommand } from "..";
import { CommandMetadataExtractor } from "./CommandMetadataExtractor";
import { CommandMetadata } from "./CommandMetadata";

export class DefaultCommandFactory implements CommandFactory{

    private readonly extractor: CommandMetadataExtractor;

    constructor(identifier: string){
        this.extractor = new CommandMetadataExtractor(identifier);
    }

    public tryCreateCommand(message: Message): Command | null{
        const metadata: CommandMetadata = this.extractor.extract(message);
        switch(metadata.alias){
            case "link":
            case "l":
                return new LinkAccountCommand(metadata.options);
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
                return new HelpCommand();
            default:
                return null;
        }
    }
}