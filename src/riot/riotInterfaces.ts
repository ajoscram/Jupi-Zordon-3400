export interface RawMatch {
    readonly gameId: string,
    readonly gameCreation: number,
    readonly gameDuration: number,
    readonly queueId: number,
    readonly teams: RawTeam[],
    readonly participants: RawParticipant[] 
}

export interface RawSummoner {
    readonly accountId: string, 
    readonly name: string
}

export interface RawTeam {
    readonly teamId: number,
    readonly win: string,
    readonly towerKills: number,
    readonly baronKills: number,
    readonly dragonKills: number,
    readonly riftHeraldKills: number,
    readonly bans: RawBan[]
}

export interface RawBan {
    readonly championId: number
}

export interface RawParticipant {
    readonly participantId: number,
    readonly teamId: number,
    readonly championId: number,
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
    readonly role: string,
    readonly lane: string
}

