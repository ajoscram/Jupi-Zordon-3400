import { BotError } from '../concretions';
import { Channel, CompletedMatch, User, OngoingMatch, Account, SummonerOverallStats } from '../model'

export interface Message{
    getInvoker(): User;
    getInvokingChannel(): Channel;
    getContent(): string;
    send(error: BotError): void;
    send(teams: [Account[], Account[]]): void;
    send(stats: SummonerOverallStats): void;
    send(match: OngoingMatch, probabilityBlueWins: number): void;
    send(match: CompletedMatch): void;
    send(account: Account): void;
    send(text: string): void;
}