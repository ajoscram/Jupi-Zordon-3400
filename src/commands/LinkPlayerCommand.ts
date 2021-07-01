import { Command } from "../core/abstractions";
import { BotError, Context } from "../core/concretions";
import { User, Account, Summoner } from "../core/model";
import { CommandUtils } from "../util";

export class LinkPlayerCommand extends Command{

    private readonly username: string;
    private readonly summonerName: string;

    constructor(options: string[]){
        super(options);
        new CommandUtils().validateOptionsLength(options, [ 2 ]);
        [ this.username, this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const user: User = context.server.getUser(this.username);
        const summoner: Summoner = await context.fetcher.getSummoner(this.summonerName);
        const account: Account = { summoner, user };
        await context.database.upsert(account);
        context.message.reply(account);
    }
}