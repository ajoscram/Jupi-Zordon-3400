import { CompletedMatch, DiscordUser, OngoingMatch, Player, Summoner, SummonerOverallStats } from "../model";

export interface Database{
    getPlayer(user: DiscordUser): Player;
    getPlayers(users: DiscordUser[]): Player[];
    getSummonerOverallStats(summoner: Summoner): SummonerOverallStats;
    upsert(player: Player): void;
    insert(ongoingMatch: OngoingMatch): void;
    insert(completedMatch: CompletedMatch): void;
}