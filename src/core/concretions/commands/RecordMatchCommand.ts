import { Command } from "../../abstractions";
import { Context } from "..";
import { CompletedMatch, OngoingMatch, ServerIdentity, Summoner } from "../../model";
import { CommandUtils } from "../util";

export class RecordMatchCommand extends Command{

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
        const serverIdentity: ServerIdentity = context.server.getIdentity();

        const ongoingMatch: OngoingMatch = await context.matchFetcher.getOngoingMatch(summoner, serverIdentity);
        const probabilityBlueWins: number = await context.predictor.predict(ongoingMatch);
        await context.database.insert(ongoingMatch);
        context.message.send(ongoingMatch, probabilityBlueWins);

        const completedMatch: CompletedMatch = await context.matchFetcher.getCompletedMatch(ongoingMatch);
        await context.database.insert(completedMatch);
        context.message.send(completedMatch);
    }
}