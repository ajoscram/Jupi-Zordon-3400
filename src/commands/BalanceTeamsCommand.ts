import { Command } from "../core/abstractions";
import { BotError, Context } from "../core/concretions";
import { Channel, User, Account } from "../core/model";

export class BalanceTeamsCommand extends Command{
    private readonly channelName: string;

    constructor(options: string[]){
        super(options);
        this.channelName = this.tryGetChannelName();
    }

    public async execute(context: Context): Promise<void>{
        const channel: Channel = this.getChannel(context);
        const users: User[] = context.message.getUsersInChannel(channel);
        const accounts: Account[] = await context.database.getAccounts(users);
        const balancedTeams: [Account[], Account[]] = await context.predictor.balance(accounts);
        context.message.reply(balancedTeams);
    }

    private getChannel(context: Context): Channel{
        if(this.channelName)
            return context.message.getChannel(this.channelName);
        else
            return context.message.getInvokingChannel();
    }

    private tryGetChannelName(): string{
        switch(this.options.length){
            case 0:
                return null;
            case 1:
                return this.options[0];
            default:
                throw new BotError("Provide either a channel name on this server or no parameters for this command.");
        }
    }
}