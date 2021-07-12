import { BotError } from '../concretions';
import { Channel, CompletedMatch, User, Account, SummonerOverallStats, Prediction } from '../model'

export interface Message{
    getInvoker(): User;
    getInvokingChannel(): Channel;
    getContent(): string;
    sendError(error: BotError): void;
    sendTeams(teams: [Account[], Account[]]): void;
    sendSummonerStats(stats: SummonerOverallStats): void;
    sendPrediction(prediction: Prediction): void;
    sendMatch(match: CompletedMatch): void;
    sendAccount(account: Account): void;
    sendText(text: string): void;
}