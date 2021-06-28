import { Command, Message } from "../core/abstractions";
import { Context } from "../core/concretions";
import { Channel, DiscordUser, Player } from "../core/model";

export class BalanceTeamsCommand extends Command{
    constructor(message: Message){
        super(message);
    }

    public async execute(context: Context): Promise<void> {
        const options: string[] = this.message.getCommandOptions();
        const channel: Channel = this.getChannel(options);

        const users: DiscordUser[] = this.message.getUsersInChannel(channel);
        const players: Player[] = await context.database.getPlayers(users);
        const balancedTeams: [Player[], Player[]] = await context.predictor.balance(players);
        
        const reply: string = this.createReply(balancedTeams);
        this.message.reply(reply);
    }

    private getChannel(options: string[]): Channel{
        const channelName: string = this.tryGetChannelName(options);
        if(channelName)
            return this.message.getChannel(channelName);
        else
            return this.message.getInvokingChannel();
    }

    private tryGetChannelName(options: string[]): string{
        switch(options.length){
            case 0:
                return null;
            case 1:
                return options[0];
            default:
                throw new Error("Method not implemented.");
        }
    }

    private createReply(teams: [Player[], Player[]]): string{
        throw new Error("Method not implemented.");
    }
}