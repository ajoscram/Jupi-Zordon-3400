export enum TeamId {
    BLUE = 100,
    RED = 200
}

export enum RawRole {
    SOLO = "SOLO",
    DUO_CARRY = "DUO_CARRY",
    DUO_SUPPORT = "DUO_SUPPORT",
    JUNGLE = "JUNGLE"
}

export enum RawLane {
    TOP = "TOP",
    MIDDLE = "MIDDLE",
    BOTTOM = "BOTTOM"
}

interface RawMatch {
    readonly gameId: number,
    readonly gameType: string,
    readonly platformId: string
}

interface RawParticipant {
    readonly teamId: TeamId,
    readonly championId: number
}

export interface RawOngoingMatch extends RawMatch {
    readonly gameStartTime: number,
    readonly participants: RawOngoingMatchParticipant[],
    readonly bannedChampions: RawBan[]
}

export interface RawOngoingMatchParticipant extends RawParticipant {
    readonly summonerId: string,
    readonly summonerName: string
}

export interface RawCompletedMatch extends RawMatch {
    readonly gameCreation: number,
    readonly gameDuration: number,
    readonly teams: RawTeam[],
    readonly participants: RawCompletedMatchParticipant[] 
}

export interface RawTeam {
    readonly teamId: TeamId,
    readonly win: string,
    readonly towerKills: number,
    readonly baronKills: number,
    readonly dragonKills: number,
    readonly riftHeraldKills: number
}

export interface RawBan {
    readonly championId: number,
    readonly teamId: TeamId
}

export interface RawCompletedMatchParticipant extends RawParticipant {
    readonly participantId: number,
    readonly stats: RawStats
}

export interface RawStats {
    readonly kills: number,
    readonly deaths: number,
    readonly assists: number,
    readonly largestKillingSpree: number,
    readonly largestMultiKill: number,
    readonly pentaKills: number,
    readonly totalDamageDealtToChampions: number,
    readonly damageDealtToObjectives: number,
    readonly visionScore: number,
    readonly timeCCingOthers: number,
    readonly totalDamageTaken: number,
    readonly goldEarned: number,
    readonly totalMinionsKilled: number,
    readonly neutralMinionsKilled: number,
    readonly firstBloodKill: boolean,
    readonly firstTowerKill: boolean,
    readonly timeline: RawTimeline
}

export interface RawTimeline {
    readonly role: RawRole,
    readonly lane: RawLane
}

export interface RawSummoner {
    readonly id: string, 
    readonly name: string
}

export interface RawChampionContainer {
    readonly data: { [ championNameId: string ]: RawChampion }
}

export interface RawChampion {
    readonly key: string,
    readonly name: string,
    readonly image: {
        readonly full: string
    }
}