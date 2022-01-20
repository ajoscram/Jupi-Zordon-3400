import { Command } from "../../abstractions";
import { Context } from "..";
import { OngoingMatch, Prediction, ServerIdentity, Summoner } from "../../model";
import { CommandUtils } from "./CommandUtils";

export class RecordMatchCommand implements Command{

    private readonly summonerName: string;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [0, 1]);
        [ this.summonerName ] = options;
    }

    public async execute(context: Context): Promise<void> {
        const summoner: Summoner = await CommandUtils.getSummoner(context, this.summonerName);
        const serverIdentity: ServerIdentity = context.server.getIdentity();
        const match: OngoingMatch = await context.ongoingMatchFetcher.getOngoingMatch(summoner, serverIdentity);
        const prediction: Prediction = await context.predictor.predict(match);
        
        await context.database.insertOngoingMatch(match);
        await context.message.replyWithRecordedMatch(match, prediction);
    }
}