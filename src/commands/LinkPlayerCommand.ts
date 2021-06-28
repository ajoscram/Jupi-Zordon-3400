import { Command, Message } from "../core/abstractions";
import { Context } from "../core/concretions";
import { DiscordUser, Player, Summoner } from "../core/model";

export class LinkPlayerCommand extends Command{
    constructor(message: Message){
        super(message);
    }

    public async execute(context: Context): Promise<void> {
        const options = this.message.getCommandOptions();
        this.validateOptions(options);
        const discordName = options[0];
        const summonerName = options[1];
        
        const discordUser: DiscordUser = this.message.getUser(discordName);
        const summoner: Summoner = await context.fetcher.getSummoner(summonerName);
        const player: Player = { summoner, discordUser };
        await context.database.upsert(player);
        
        const reply: string = this.createReply(player);
        this.message.reply(reply);
    }

    private validateOptions(options: string[]): void{
        throw new Error("Method not implemented.");
    }

    private createReply(player: Player): string{
        throw new Error("Method not implemented.");
    }
}