import { BotError } from '../concretions';
import { Channel, CompletedMatch, User, OngoingMatch, Account, SummonerOverallStats } from '../model'

export interface Message{
    getInvoker(): User;
    getInvokingChannel(): Channel;
    getContent(): string;
    sendError(error: BotError): void;
    sendTeams(teams: [Account[], Account[]]): void;
    sendSummonerStats(stats: SummonerOverallStats): void;
    sendPrediction(match: OngoingMatch, probabilityBlueWins: number): void;
    sendMatch(match: CompletedMatch): void;
    sendAccount(account: Account): void;
    sendText(text: string): void;
}