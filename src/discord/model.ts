export enum TeamId {
    BLUE = 100,
    RED = 200
}

export interface RawCompletedMatch{
    readonly matchId: string,
    readonly gameDuration: number,
    readonly participants: RawParticipant[]
}

export interface RawParticipant{
    readonly WIN: string,
    readonly DRAGON_KILLS: number,
    readonly BARON_KILLS: number,
    readonly TURRETS_KILLED: number,
    /*herald kills missing*/
    readonly ASSISTS: number,
    readonly CHAMPIONS_KILLED: number,
    readonly GOLD_EARNED: number,
    readonly INDIVIDUAL_POSITION: string,
    readonly LARGEST_MULTI_KILL: number,
    readonly LARGEST_KILLING_SPREE: number,
    readonly MINIONS_KILLED: number,
    readonly NAME: string,
    readonly NEUTRAL_MINIONS_KILLED: number,
    readonly NUM_DEATHS: number,
    readonly PENTA_KILLS: number,
    readonly SKIN: string,
    readonly TEAM: TeamId,
    readonly TEAM_POSITION: string,
    readonly TIME_CCING_OTHERS: number,
    readonly TOTAL_DAMAGE_DEALT_TO_CHAMPIONS: number,
    readonly TOTAL_DAMAGE_DEALT_TO_OBJECTIVES: number,
    readonly TOTAL_DAMAGE_TAKEN: number,
    readonly VISION_SCORE: number,
}