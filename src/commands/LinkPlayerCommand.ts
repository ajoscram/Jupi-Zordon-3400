import { Command, Message } from "../core/abstractions";
import { BotError, Context } from "../core/concretions";
import { DiscordUser, Player, Summoner } from "../core/model";

export class LinkPlayerCommand extends Command{
    constructor(message: Message){
        super(message);
    }

    public async execute(context: Context): Promise<void> {
        const options = this.message.getCommandOptions();
        this.validateOptions(options);
        const [ discordName, summonerName ] = options;
        
        const discordUser: DiscordUser = this.message.getUser(discordName);
        const summoner: Summoner = await context.fetcher.getSummoner(summonerName);
        const player: Player = { summoner, discordUser };
        await context.database.upsert(player);

        this.message.reply(player);
    }

    private validateOptions(options: string[]): void{
        if(options.length != 2)
            throw new BotError("Please provide the player's discord account and summoner names to this command.");
    }
}