import { BotError } from '../concretions';
import { Channel, CompletedMatch, DiscordUser, OngoingMatch, Player, Server, SummonerOverallStats } from '../model'

export interface Message{
    getInvoker(): DiscordUser;
    getInvokingChannel(): Channel;
    getUsersInChannel(channel: Channel): DiscordUser[];
    getUser(name: string): DiscordUser;
    getChannel(name: string): Channel;
    getServer(): Server;

    reply(error: BotError): void;
    reply(teams: [Player[], Player[]]): void;
    reply(stats: SummonerOverallStats): void;
    reply(match: OngoingMatch, probabilityBlueWins: number): void;
    reply(match: CompletedMatch): void;
    reply(player: Player): void;
}