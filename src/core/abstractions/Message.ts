import { BotError } from '../concretions';
import { Channel, CompletedMatch, User, OngoingMatch, Account, Server, SummonerOverallStats } from '../model'

export interface Message{
    getInvoker(): User;
    getInvokingChannel(): Channel;
    getUsersInChannel(channel: Channel): User[];
    getUser(name: string): User;
    getChannel(name: string): Channel;
    getServer(): Server;

    reply(error: BotError): void;
    reply(teams: [Account[], Account[]]): void;
    reply(stats: SummonerOverallStats): void;
    reply(match: OngoingMatch, probabilityBlueWins: number): void;
    reply(match: CompletedMatch): void;
    reply(player: Account): void;
}