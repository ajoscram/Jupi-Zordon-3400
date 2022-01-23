import { Command } from "../../interfaces";
import { Context } from "..";
import { Summoner, SummonerOverallStats } from "../../model";
import { CommandUtils } from "./CommandUtils";

export class GetPlayerStatsCommand implements Command{

    private readonly summonerName: string;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [0, 1]);
        [ this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const summoner: Summoner = await CommandUtils.getSummoner(context, this.summonerName);
        const stats: SummonerOverallStats = await context.database.getSummonerOverallStats(summoner);
        await context.message.replyWithSummonerStats(stats);
    }
}