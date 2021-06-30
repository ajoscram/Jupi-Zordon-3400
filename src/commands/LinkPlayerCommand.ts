import { Command } from "../core/abstractions";
import { BotError, Context } from "../core/concretions";
import { User, Account, Summoner } from "../core/model";

export class LinkPlayerCommand extends Command{
    private readonly username: string;
    private readonly summonerName: string;

    constructor(options: string[]){
        super(options);
        this.validateOptions(options);
        [ this.username, this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const user: User = context.message.getUser(this.username);
        const summoner: Summoner = await context.fetcher.getSummoner(this.summonerName);
        const account: Account = { summoner, user };
        await context.database.upsert(account);
        context.message.reply(account);
    }

    private validateOptions(options: string[]): void{
        if(options.length != 2)
            throw new BotError("Please provide the player's server username and summoner names to this command.");
    }
}