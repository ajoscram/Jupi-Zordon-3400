import { Message, Server } from "src/core/abstractions";
import { ErrorCode } from "src/core/concretions";
import { User, Channel, Account, SummonerOverallStats, CompletedMatch, Prediction, OngoingMatch } from "src/core/model";
import { MockServer } from ".";

export class MockMessage implements Message{

    private static readonly HELP_ITEM: string = "help_item";
    public readonly sentItems: any[] = [];

    constructor(
        private readonly content: string
    ){}

    public getServer(): Server{
        return new MockServer();
    }

    public getAuthor(): User {
        return { id: "user_id", name: "user_name" };
    }

    public getChannel(): Channel {
        return { id: "channel_id", name: "channel_name" };
    }

    public getContent(): string {
        return this.content;
    }

    public async replyWithError(error: ErrorCode): Promise<void> {
        this.sentItems.push(error);
    }

    public async replyWithTeams(teams: [Account[], Account[]]): Promise<void> {
        this.sentItems.push(teams);
    }

    public async replyWithSummonerStats(stats: SummonerOverallStats): Promise<void> {
        this.sentItems.push(stats);
    }

    public async replyWithRecordedMatch(match: OngoingMatch, prediction: Prediction): Promise<void> {
        this.sentItems.push(match);
        this.sentItems.push(prediction);
    }

    public async replyWithKeptMatches(matches: CompletedMatch[]): Promise<void> {
        this.sentItems.push(matches);
    }

    public async replyWithRecordedMatches(matches: OngoingMatch[]): Promise<void> {
        this.sentItems.push(matches);
    }

    public async replyWithDiscardedMatches(matches: OngoingMatch[]): Promise<void> {
        this.sentItems.push(matches);
    }

    public async replyWithAccount(account: Account): Promise<void> {
        this.sentItems.push(account);
    }

    public async replyWithHelp(): Promise<void> {
        this.sentItems.push(MockMessage.HELP_ITEM);
    }
}