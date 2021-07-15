import { Command } from "../../abstractions";
import { Context } from "..";
import { User, Account, Summoner } from "../../model";
import { CommandUtils } from "./util";

export class LinkAccountCommand implements Command{

    private readonly username: string;
    private readonly summonerName: string;

    constructor(options: string[]){
        new CommandUtils().validateOptionsLength(options, [ 2 ]);
        [ this.username, this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const user: User = context.server.getUser(this.username);
        const summoner: Summoner = await context.summonerFetcher.getSummoner(this.summonerName);
        const account: Account = { summoner, user };
        await context.database.upsert(account);
        context.message.replyWithAccount(account);
    }
}