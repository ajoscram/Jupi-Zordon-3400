import { Message } from '.';
import { Context } from '../concretions';
import { DiscordUser, Player, Summoner } from '../model';

export abstract class Command{
    constructor(
        protected readonly options: string[]
    ){ }

    public abstract execute(context: Context): Promise<void>;

    protected async getSummoner(context: Context): Promise<Summoner>{
        const summonerName: string = this.tryGetSummonerName();
        if(summonerName){
            return await context.fetcher.getSummoner(summonerName);
        }
        else{
            const discordUser: DiscordUser = context.message.getInvoker();
            const player: Player = await context.database.getPlayer(discordUser);
            return player.summoner;
        }
    }

    private tryGetSummonerName(): string{
        switch(this.options.length){
            case 0:
                return null;
            case 1:
                return this.options[0];
            default:
                throw new Error("Please provide the player's summoner name or no parameters to this command.");
        }
    }
}