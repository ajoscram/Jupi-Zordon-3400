import { Command, Message } from "../core/abstractions";
import { Context } from "../core/concretions";
import { Summoner, SummonerOverallStats } from "../core/model";

export class GetPlayerStatsCommand extends Command{
    constructor(message: Message){
        super(message);
    }

    public async execute(context: Context): Promise<void> {
        const options: string[] = this.message.getCommandOptions();
        const summoner: Summoner = await this.getSummoner(options, context);
        const stats: SummonerOverallStats = await context.database.getSummonerOverallStats(summoner);
        this.message.reply(stats);
    }
}