import { Champion, Role, Summoner } from ".";

interface Stats{
    readonly assists: number,
    readonly deaths: number,
    readonly damageDealtToChampions: number,
    readonly damageDealtToObjectives: number,
    readonly damageReceived: number,
    readonly gold: number,
    readonly kills: number,
    readonly minions: number,
    readonly minutesPlayed: number,
    readonly visionScore: number,
    readonly crowdControlScore: number,
    readonly pentakills: number
}

export interface PerformanceStats extends Stats{
    readonly summoner: Summoner,
    readonly champion: Champion,
    readonly largestMultikill: number,
    readonly largestKillingSpree: number,
    readonly firstBlood: boolean,
    readonly firstTower: boolean,
    readonly role: Role
}

export interface OverallStats extends Stats{
    readonly wins: number,
    readonly losses: number,
}

export interface SummonerOverallStats extends OverallStats{
    readonly summoner: Summoner,
    readonly picks: Map<Champion, number>,
}

export interface ChampionOverallStats extends OverallStats{
    readonly champion: Champion,
    readonly bans: number,
}

export interface TeamStats{
    readonly bans: Champion[],
    readonly won: boolean,
    readonly dragons: number,
    readonly heralds: number, 
    readonly barons: number,
    readonly towers: number,
    readonly performanceStats: PerformanceStats[],
}