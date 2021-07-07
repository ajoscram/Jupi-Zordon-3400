import { Command } from "../../abstractions";
import { Context } from "..";
import { Channel, User, Account } from "../../model";
import { CommandUtils } from "./util";

export class BalanceTeamsCommand implements Command{

    private readonly channelName: string;

    constructor(options: string[]){
        new CommandUtils().validateOptionsLength(options, [ 0, 1 ]);
        [ this.channelName ] = options;
    }

    public async execute(context: Context): Promise<void>{
        const channel: Channel = this.getChannel(context);
        const users: User[] = context.server.getUsersInChannel(channel);
        const accounts: Account[] = await context.database.getAccounts(users);
        const balancedTeams: [Account[], Account[]] = await context.predictor.balance(accounts);
        context.message.send(balancedTeams);
    }

    private getChannel(context: Context): Channel{
        if(this.channelName)
            return context.server.getChannel(this.channelName);
        else
            return context.message.getInvokingChannel();
    }
}