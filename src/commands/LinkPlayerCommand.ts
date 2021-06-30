import { Command, Message } from "../core/abstractions";
import { BotError, Context } from "../core/concretions";
import { DiscordUser, Player, Summoner } from "../core/model";

export class LinkPlayerCommand extends Command{
    private readonly discordName: string;
    private readonly summonerName: string;

    constructor(options: string[]){
        super(options);
        this.validateOptions(options);
        [ this.discordName, this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const discordUser: DiscordUser = context.message.getUser(this.discordName);
        const summoner: Summoner = await context.fetcher.getSummoner(this.summonerName);
        const player: Player = { summoner, discordUser };
        await context.database.upsert(player);
        context.message.reply(player);
    }

    private validateOptions(options: string[]): void{
        if(options.length != 2)
            throw new BotError("Please provide the player's discord account and summoner names to this command.");
    }
}