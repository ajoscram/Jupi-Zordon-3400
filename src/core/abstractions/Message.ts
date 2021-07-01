import { BotError } from '../concretions';
import { Channel, CompletedMatch, User, OngoingMatch, Account, SummonerOverallStats } from '../model'

export interface Message{
    getInvoker(): User;
    getInvokingChannel(): Channel;

    reply(error: BotError): void;
    reply(teams: [Account[], Account[]]): void;
    reply(stats: SummonerOverallStats): void;
    reply(match: OngoingMatch, probabilityBlueWins: number): void;
    reply(match: CompletedMatch): void;
    reply(account: Account): void;
}