import { Message } from '.';
import { Context } from '../concretions';
import { DiscordUser, Player, Summoner } from '../model';

export abstract class Command{
    constructor(
        public message: Message
    ){ }

    public abstract execute(context: Context): Promise<void>;

    protected async getSummoner(options: string[], context: Context): Promise<Summoner>{
        const summonerName: string = this.tryGetSummonerName(options);
        if(summonerName){
            return await context.fetcher.getSummoner(summonerName);
        }
        else{
            const discordUser: DiscordUser = this.message.getInvoker();
            const player: Player = await context.database.getPlayer(discordUser);
            return player.summoner;
        }
    }

    private tryGetSummonerName(options: string[]): string{
        switch(options.length){
            case 0:
                return null;
            case 1:
                return options[0];
            default:
                throw new Error("Method not implemented.");
        }
    }
}