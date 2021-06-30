import { Command, Message, CommandMetadata } from "../core/abstractions";
import { BalanceTeamsCommand, GetPlayerStatsCommand, LinkPlayerCommand, RecordMatchCommand } from "../commands";

export class CommandFactory{
    public tryCreateCommand(metadata: CommandMetadata): Command{
        const options: string[] = metadata.getCommandOptions();
        switch(metadata.getCommandToken()){
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
            default:
                return null;
        }
    }
}