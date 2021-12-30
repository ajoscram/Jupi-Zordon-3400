import { Champion, PerformanceStats } from ".";

export interface TeamStats{
    readonly won: boolean,
    readonly dragons: number,
    readonly heralds: number, 
    readonly barons: number,
    readonly towers: number,
    readonly bans: Champion[],
    readonly performanceStats: PerformanceStats[]
}