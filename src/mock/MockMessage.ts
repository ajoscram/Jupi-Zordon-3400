import { Message } from "src/core/abstractions";
import { ErrorCode } from "src/core/concretions";
import { User, Channel, Account, SummonerOverallStats, CompletedMatch, Prediction } from "src/core/model";

export class MockMessage implements Message{

    public static readonly HELP_ITEM: string = "help_item";
    public readonly sentItems: any[] = [];

    constructor(
        private readonly content: string
    ){}

    public getInvoker(): User {
        return { id: "user_id", name: "user_name" };
    }

    public getInvokingChannel(): Channel {
        return { id: "channel_id", name: "channel_name" };
    }

    public getContent(): string {
        return this.content;
    }

    public sendError(error: ErrorCode): void {
        this.sentItems.push(error);
    }

    public sendTeams(teams: [Account[], Account[]]): void {
        this.sentItems.push(teams);
    }

    public sendSummonerStats(stats: SummonerOverallStats): void {
        this.sentItems.push(stats);
    }

    public sendPrediction(prediction: Prediction): void {
        this.sentItems.push(prediction);
    }

    public sendMatch(match: CompletedMatch): void {
        this.sentItems.push(match);
    }

    public sendAccount(account: Account): void {
        this.sentItems.push(account);
    }

    public sendHelp(): void {
        this.sentItems.push(MockMessage.HELP_ITEM);
    }
}