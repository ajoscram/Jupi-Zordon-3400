import { Summoner, Server, Champion, TeamStats } from ".";

interface Match{
    id: string,
    server: Server
}

export interface OngoingMatch extends Match{
    map: Map<Summoner, Champion>
}

export interface CompletedMatch extends Match{
    red: TeamStats,
    blue: TeamStats,
    minutesPlayed: number,
    date: Date,
}