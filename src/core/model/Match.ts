import { ServerIdentity, TeamStats, Participant } from ".";

interface Match{
    readonly id: string,
    readonly date: Date,
    readonly serverIdentity: ServerIdentity
}

export interface OngoingMatch extends Match {
    readonly blue: Participant[],
    readonly red: Participant[]
}

export interface CompletedMatch extends Match {
    readonly red: TeamStats,
    readonly blue: TeamStats,
    readonly minutesPlayed: number
}