import { Command, Message } from "../core/abstractions";
import { Context } from "../core/concretions";
import { Summoner, SummonerOverallStats } from "../core/model";

export class GetPlayerStatsCommand extends Command{
    constructor(options: string[]){
        super(options);
    }

    public async execute(context: Context): Promise<void> {
        const summoner: Summoner = await this.getSummoner(context);
        const stats: SummonerOverallStats = await context.database.getSummonerOverallStats(summoner);
        context.message.reply(stats);
    }
}