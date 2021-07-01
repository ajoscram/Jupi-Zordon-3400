import { ServerIdentity, Summoner, Champion, TeamStats } from ".";

interface Match{
    id: string,
    serverIdentity: ServerIdentity
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