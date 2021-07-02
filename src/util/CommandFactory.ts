import { Command, CommandMetadata } from "../core/abstractions";
import { BalanceTeamsCommand, GetPlayerStatsCommand, HelpCommand, LinkPlayerCommand, RecordMatchCommand } from "../commands";

export class CommandFactory{
    public tryCreateCommand(metadata: CommandMetadata): Command{
        const options: string[] = metadata.getOptions();
        switch(metadata.getToken()){
            case "link":
            case "l":
                return new LinkPlayerCommand(options);
            case "balance":
            case "b":
                return new BalanceTeamsCommand(options);
            case "record":
            case "r":
                return new RecordMatchCommand(options);
            case "stats":
            case "s":
                return new GetPlayerStatsCommand(options);
            case "help":
            case "h":
                return new HelpCommand(options);
            default:
                return null;
        }
    }
}