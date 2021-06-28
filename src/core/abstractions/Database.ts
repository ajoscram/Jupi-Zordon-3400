import { CompletedMatch, DiscordUser, OngoingMatch, Player, Summoner, SummonerOverallStats } from "../model";

export interface Database{
    getPlayer(user: DiscordUser): Promise<Player>;
    getPlayers(users: DiscordUser[]): Promise<Player[]>;
    getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats>;
    upsert(player: Player): Promise<void>;
    insert(ongoingMatch: OngoingMatch): Promise<void>;
    insert(completedMatch: CompletedMatch): Promise<void>;
}