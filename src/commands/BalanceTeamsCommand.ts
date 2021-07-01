import { Command } from "../core/abstractions";
import { BotError, Context } from "../core/concretions";
import { Channel, User, Account } from "../core/model";
import { CommandUtils } from "../util";

export class BalanceTeamsCommand extends Command{

    private readonly channelName: string;

    constructor(options: string[]){
        super(options);
        new CommandUtils().validateOptionsLength(options, [ 1 ]);
        [ this.channelName ] = options;
    }

    public async execute(context: Context): Promise<void>{
        const channel: Channel = this.getChannel(context);
        const users: User[] = context.server.getUsersInChannel(channel);
        const accounts: Account[] = await context.database.getAccounts(users);
        const balancedTeams: [Account[], Account[]] = await context.predictor.balance(accounts);
        context.message.reply(balancedTeams);
    }

    private getChannel(context: Context): Channel{
        if(this.channelName)
            return context.server.getChannel(this.channelName);
        else
            return context.message.getInvokingChannel();
    }
}