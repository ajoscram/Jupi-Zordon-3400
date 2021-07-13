import { Message } from "src/core/abstractions";
import { BotError } from "src/core/concretions";
import { User, Channel, Account, SummonerOverallStats, Prediction, CompletedMatch } from "src/core/model";

export class DiscordMessage implements Message{
    getInvoker(): User {
        throw new Error("Method not implemented.");
    }
    getInvokingChannel(): Channel {
        throw new Error("Method not implemented.");
    }
    getContent(): string {
        throw new Error("Method not implemented.");
    }
    sendError(error: BotError): void {
        throw new Error("Method not implemented.");
    }
    sendTeams(teams: [Account[], Account[]]): void {
        throw new Error("Method not implemented.");
    }
    sendSummonerStats(stats: SummonerOverallStats): void {
        throw new Error("Method not implemented.");
    }
    sendPrediction(prediction: Prediction): void {
        throw new Error("Method not implemented.");
    }
    sendMatch(match: CompletedMatch): void {
        throw new Error("Method not implemented.");
    }
    sendAccount(account: Account): void {
        throw new Error("Method not implemented.");
    }
    sendText(text: string): void {
        throw new Error("Method not implemented.");
    }
}