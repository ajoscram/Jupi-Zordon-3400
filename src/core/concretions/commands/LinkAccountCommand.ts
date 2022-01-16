import { Command } from "../../abstractions";
import { Context } from "..";
import { User, Account, Summoner } from "../../model";
import { CommandUtils } from "./CommandUtils";

export class LinkAccountCommand implements Command{

    private readonly username: string;
    private readonly summonerName: string;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [ 1, 2 ]);
        [ this.summonerName, this.username ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const summoner: Summoner = await context.summonerFetcher.getSummoner(this.summonerName);
        const user: User = this.getUser(context, this.username);
        const account: Account = { summoner, user };
        await context.database.upsertAccount(account);
        await context.message.replyWithAccount(account);
    }

    private getUser(context: Context, username?: string): User{
        return username ?
            context.server.getUser(this.username) :
            context.message.getAuthor();
    }
}