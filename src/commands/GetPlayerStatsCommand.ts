import { Command } from "../core/abstractions";
import { Context } from "../core/concretions";
import { Summoner, SummonerOverallStats } from "../core/model";
import { CommandUtils } from "../util";

export class GetPlayerStatsCommand extends Command{

    private readonly utils: CommandUtils;
    private readonly summonerName: string;

    constructor(options: string[]){
        super(options);
        this.utils = new CommandUtils();
        this.utils.validateOptionsLength(options, [0, 1]);
        [ this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const summoner: Summoner = await this.utils.getSummoner(context, this.summonerName);
        const stats: SummonerOverallStats = await context.database.getSummonerOverallStats(summoner);
        context.message.send(stats);
    }
}