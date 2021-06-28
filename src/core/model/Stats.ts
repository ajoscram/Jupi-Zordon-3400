import { Champion, Summoner } from ".";

interface Stats{
    assists: number,
    deaths: number,
    damageDealtToChampions: number,
    damageDealtToObjectives: number,
    damageReceived: number,
    gold: number,
    kills: number,
    minions: number,
    minutesPlayed: number,
    visionScore: number,
    crowdControlScore: number,
}

export interface PerformanceStats extends Stats{
    summoner: Summoner,
    champion: Champion,
    largestMultikill: number,
    largestKillingSpree: number,
    firstBlood: boolean,
    firstTower: boolean,
    won: boolean,
}

interface OverallStats extends Stats{
    wins: number,
    losses: number,
}

export interface SummonerOverallStats extends OverallStats{
    summoner: Summoner,
    picks: Map<Champion, number>,
}

export interface ChampionOverallStats{
    champion: Champion,
    bans: number,
}

export interface TeamStats{
    bans: Champion[],
    won: boolean,
    dragons: number,
    heralds: number, 
    barons: number,
    towers: number,
    performanceStats: PerformanceStats[],
}