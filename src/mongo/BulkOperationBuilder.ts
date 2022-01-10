import { AnyBulkWriteOperation, PushOperator } from "mongodb";
import { Champion, PerformanceStats, Summoner, TeamStats } from "../core/model";
import { IndexKey } from "./enums";

export class BulkOperationBuilder{
    private readonly operations: AnyBulkWriteOperation[] = [];

    public addInsertSummonerStatsOperations(team: TeamStats, minutesPlayed: number): BulkOperationBuilder {
        for(const performance of team.performanceStats)
            this.addInsertSummonerStatsOperation(performance, team.won, minutesPlayed);
        return this;
    }

    public addInsertChampionStatsOperations(team: TeamStats, minutesPlayed: number): BulkOperationBuilder {
        for(const performance of team.performanceStats)
            this.addInsertChampionStatsOperation(performance, team.won, minutesPlayed);
        return this;
    }

    public addInsertBanOperations(bans: Champion[]): BulkOperationBuilder {
        for(const ban of bans)
            this.addInsertBanOperation(ban);
        return this;
    }

    private addInsertBanOperation(ban: Champion): BulkOperationBuilder{
        this.operations.push({
            updateOne: {
                filter: { [IndexKey.CHAMPION_ID]: ban.id },
                update: { 
                    $setOnInsert: { champion: ban },
                    $inc: { bans: 1 }
                },
                upsert: true
            }
        });
        return this;
    }

    private addInsertSummonerStatsOperation(performance: PerformanceStats, won: boolean, minutesPlayed: number): BulkOperationBuilder{
        this.operations.push(
            this.createSummonerStatsOperation(performance, won, minutesPlayed),
            this.createPickOperation(performance.summoner, performance.champion),
            this.createIncrementPickOperation(performance.summoner, performance.champion)
        );
        return this;
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

    private addInsertChampionStatsOperation(performance: PerformanceStats, won: boolean, minutesPlayed: number): BulkOperationBuilder{
        this.operations.push({
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
        });
        return this;
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

    public build<T>(): AnyBulkWriteOperation<T>[]{
        return this.operations as AnyBulkWriteOperation<T>[];
    }
}