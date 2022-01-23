import { Command } from "../../interfaces";
import { Context } from "..";
import { Channel, User, Account } from "../../model";
import { CommandUtils } from "./CommandUtils";

export class BalanceTeamsCommand implements Command{

    private readonly channelName: string;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [ 0, 1 ]);
        [ this.channelName ] = options;
    }

    public async execute(context: Context): Promise<void>{
        const channel: Channel = this.getChannel(context);
        const users: User[] = context.server.getUsersInChannel(channel);
        const accounts: Account[] = await context.database.getAccounts(users);
        const balancedTeams: [Account[], Account[]] = await context.predictor.balance(accounts);
        await context.message.replyWithTeams(balancedTeams);
    }

    private getChannel(context: Context): Channel{
        if(this.channelName)
            return context.server.getChannel(this.channelName);
        else{
            const user: User = context.message.getAuthor();
            return context.server.getCurrentChannel(user);
        }
    }
}