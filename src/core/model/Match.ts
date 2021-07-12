import { ServerIdentity, Summoner, Champion, TeamStats } from ".";

interface Match{
    readonly id: string,
    readonly serverIdentity: ServerIdentity
}

export interface OngoingMatch extends Match{
    readonly blue: Map<Summoner, Champion>
    readonly red: Map<Summoner, Champion>
}

export interface CompletedMatch extends Match{
    readonly red: TeamStats,
    readonly blue: TeamStats,
    readonly minutesPlayed: number,
    readonly date: Date,
}