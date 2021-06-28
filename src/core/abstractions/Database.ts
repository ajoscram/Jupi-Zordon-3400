import { CompletedMatch, DiscordUser, OngoingMatch, Player, Summoner, SummonerOverallStats } from "../model";

export interface Database{
    getPlayer(user: DiscordUser): Player;
    getPlayers(users: DiscordUser[]): Player[];
    getSummoner(summonerName: string): Summoner;
    getSummonerOverallStats(sumomner: Summoner): SummonerOverallStats;
    upsert(player: Player): void;
    insert(ongoingMatch: OngoingMatch): void;
    insert(completedMatch: CompletedMatch): void;
}