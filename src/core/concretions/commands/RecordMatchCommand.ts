import { Command } from "../../abstractions";
import { Context } from "..";
import { CompletedMatch, OngoingMatch, Prediction, ServerIdentity, Summoner } from "../../model";
import { CommandUtils } from "./CommandUtils";

export class RecordMatchCommand implements Command{

    private readonly utils: CommandUtils;
    private readonly summonerName: string;

    constructor(options: string[]){
        this.utils = new CommandUtils();
        this.utils.validateOptionsLength(options, [0, 1]);
        [ this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const summoner: Summoner = await this.utils.getSummoner(context, this.summonerName);
        const serverIdentity: ServerIdentity = context.server.getIdentity();

        const ongoingMatch: OngoingMatch = await context.matchFetcher.getOngoingMatch(summoner, serverIdentity);
        const prediction: Prediction = await context.predictor.predict(ongoingMatch);
        await context.database.insertOngoingMatch(ongoingMatch);
        context.message.replyWithPrediction(prediction);

        const completedMatch: CompletedMatch = await context.matchFetcher.getCompletedMatch(ongoingMatch);
        await context.database.insertCompletedMatch(completedMatch);
        context.message.replyWithCompletedMatch(completedMatch);
    }
}