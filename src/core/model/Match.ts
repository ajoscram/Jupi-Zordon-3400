import { Player, Server, Champion, TeamStats } from ".";

interface Match{
    id: string,
    server: Server
}

export interface OngoingMatch extends Match{
    map: Map<Player, Champion>
}

export interface CompletedMatch extends Match{
    red: TeamStats,
    blue: TeamStats,
    minutesPlayed: number,
    date: Date,
}