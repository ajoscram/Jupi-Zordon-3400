import { Command, Message } from "../core/abstractions";
import { Context } from "../core/concretions";
import { CompletedMatch, OngoingMatch, Server, Summoner } from "../core/model";

export class RecordMatchCommand extends Command{
    constructor(message: Message){
        super(message);
    }

    public async execute(context: Context): Promise<void> {
        const options: string[] = this.message.getCommandOptions();
        const summoner: Summoner = await this.getSummoner(options, context);
        const server: Server = this.message.getServer();

        const ongoingMatch: OngoingMatch = await context.fetcher.getOngoingMatch(summoner, server);
        await context.database.insert(ongoingMatch);
        const probabilityBlueWins: number = await context.predictor.predict(ongoingMatch);
        const ongoingMatchReply: string = this.createOngoingReply(ongoingMatch, probabilityBlueWins);
        this.message.reply(ongoingMatchReply);

        const completedMatch: CompletedMatch = await this.getCompletedMatch(ongoingMatch);
        await context.database.insert(completedMatch);
        const completedMatchReply: string = this.createCompletedReply(completedMatch);
        this.message.reply(completedMatchReply);
    }

    private async getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch>{
        throw new Error("Method not implemented.");
    }

    private createOngoingReply(match: OngoingMatch, probabilityBlueWins: number): string{
        throw new Error("Method not implemented.");
    }

    private createCompletedReply(match: CompletedMatch): string{
        throw new Error("Method not implemented.");
    }
}