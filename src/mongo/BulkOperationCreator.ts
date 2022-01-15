import { AnyBulkWriteOperation, PushOperator } from "mongodb";
import { Champion, ChampionOverallStats, CompletedMatch, PerformanceStats, Summoner, SummonerOverallStats, TeamStats } from "../core/model";
import { IndexKey } from "./enums";

export class BulkOperationCreator{

    public createInsertSummonerStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation<SummonerOverallStats>[] {
        const operations: AnyBulkWriteOperation<SummonerOverallStats>[] = [];
        for(const match of completedMatches){
            operations.push(...[
                ...this.getInsertSummonerStatsOperationsForTeam(match.blue, match.minutesPlayed),
                ...this.getInsertSummonerStatsOperationsForTeam(match.red, match.minutesPlayed)
            ] as AnyBulkWriteOperation<SummonerOverallStats>[]);
        }
        return operations;  
    }

    public createInsertChampionStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation<ChampionOverallStats>[] {
        const operations: AnyBulkWriteOperation<ChampionOverallStats>[] = [];
        for(const match of completedMatches){
            operations.push(...[
                ...this.getInsertChampionStatsOperationsForTeam(match.blue, match.minutesPlayed),
                ...this.getInsertChampionStatsOperationsForTeam(match.red, match.minutesPlayed)
            ] as AnyBulkWriteOperation<ChampionOverallStats>[]);
        }
        return operations;  
    }

    private getInsertSummonerStatsOperationsForTeam(team: TeamStats, minutesPlayed: number): AnyBulkWriteOperation[] {
        const operations: AnyBulkWriteOperation[] = [];
        for(const performance of team.performanceStats){
            operations.push(...[
                this.createSummonerStatsOperation(performance, team.won, minutesPlayed),
                this.createPickOperation(performance.summoner, performance.champion),
                this.createIncrementPickOperation(performance.summoner, performance.champion)
            ]);
        }
        return operations;
    }

    private getInsertChampionStatsOperationsForTeam(team: TeamStats, minutesPlayed: number): AnyBulkWriteOperation[] {
        const operations: AnyBulkWriteOperation[] = [];
        for(const ban of team.bans)
            operations.push(this.createInsertBanOperation(ban));
        for(const performance of team.performanceStats)
            operations.push(this.createInsertChampionStatsOperation(performance, team.won, minutesPlayed));
        return operations;
    }

    private createSummonerStatsOperation(performance: PerformanceStats, won: boolean, minutesPlayed: number): AnyBulkWriteOperation{
        return {
            updateOne: {
                filter: { [IndexKey.SUMMONER_ID]: performance.summoner.id },
                update: {
                    $set: { summoner: performance.summoner },
                    $setOnInsert: { picks: [] },
                    $inc: this.createOverallStatsIncrement(performance, won, minutesPlayed)
                },
                upsert: true
            }
        }
    }

    private createPickOperation(summoner: Summoner, champion: Champion): AnyBulkWriteOperation{
        return {
            updateOne: {
                filter: {
                    [IndexKey.SUMMONER_ID]: summoner.id,
                    [IndexKey.PICKS_CHAMPION_ID]: { $ne: champion.id }
                },
                update: {
                    $push: { picks: { champion } } as PushOperator<Document>
                }
            }
        }
    }

    private createIncrementPickOperation(summoner: Summoner, champion: Champion): AnyBulkWriteOperation{
        return {
            updateOne: {
                filter: {
                    [IndexKey.SUMMONER_ID]: summoner.id,
                    [IndexKey.PICKS_CHAMPION_ID]: champion.id
                },
                update: {
                    $inc: { "picks.$.count": 1 }
                }
            }
        }
    }

    private createInsertBanOperation(ban: Champion): AnyBulkWriteOperation{
        return {
            updateOne: {
                filter: { [IndexKey.CHAMPION_ID]: ban.id },
                update: { 
                    $setOnInsert: { champion: ban },
                    $inc: { bans: 1 }
                },
                upsert: true
            }
        };
    }

    private createInsertChampionStatsOperation(performance: PerformanceStats, won: boolean, minutesPlayed: number): AnyBulkWriteOperation{
        return {
            updateOne:{
                filter: { [IndexKey.CHAMPION_ID]: performance.champion.id },
                update: {
                    $setOnInsert: { "champion": performance.champion },
                    $inc: {
                        picks: 1,
                        ...this.createOverallStatsIncrement(performance, won, minutesPlayed)
                    }
                },
                upsert: true
            }
        };
    }

    private createOverallStatsIncrement(performance: PerformanceStats, won: boolean, minutesPlayed: number): { [key: string]: number }{
        return {
            wins: won ? 1 : 0,
            losses: won ? 0 : 1,
            minutesPlayed: minutesPlayed,
            assists: performance.assists,
            deaths: performance.deaths,
            damageDealtToChampions: performance.damageDealtToChampions,
            damageDealtToObjectives: performance.damageDealtToObjectives,
            damageReceived: performance.damageReceived,
            gold: performance.gold,
            kills: performance.kills,
            minions: performance.minions,
            visionScore: performance.visionScore,
            crowdControlScore: performance.crowdControlScore,
            pentakills: performance.pentakills,
        }
    }
}