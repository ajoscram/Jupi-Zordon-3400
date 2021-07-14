import { Message } from "src/core/abstractions";
import { ErrorCode } from "src/core/concretions";
import { User, Channel, Account, SummonerOverallStats, CompletedMatch, Prediction } from "src/core/model";

export class MockMessage implements Message{

    public static readonly HELP_ITEM: string = "help_item";
    public readonly sentItems: any[] = [];

    constructor(
        private readonly content: string
    ){}

    public getAuthor(): User {
        return { id: "user_id", name: "user_name" };
    }

    public getChannel(): Channel {
        return { id: "channel_id", name: "channel_name" };
    }

    public getContent(): string {
        return this.content;
    }

    public replyWithError(error: ErrorCode): void {
        this.sentItems.push(error);
    }

    public replyWithTeams(teams: [Account[], Account[]]): void {
        this.sentItems.push(teams);
    }

    public replyWithSummonerStats(stats: SummonerOverallStats): void {
        this.sentItems.push(stats);
    }

    public replyWithPrediction(prediction: Prediction): void {
        this.sentItems.push(prediction);
    }

    public replyWithCompletedMatch(match: CompletedMatch): void {
        this.sentItems.push(match);
    }

    public replyWithAccount(account: Account): void {
        this.sentItems.push(account);
    }

    public replyWithHelp(): void {
        this.sentItems.push(MockMessage.HELP_ITEM);
    }
}