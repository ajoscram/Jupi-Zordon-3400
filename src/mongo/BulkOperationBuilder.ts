import { AnyBulkWriteOperation, PushOperator } from "mongodb";
import { Champion, PerformanceStats, Summoner } from "../core/model";

export class BulkOperationBuilder{
    private readonly operations: AnyBulkWriteOperation[] = [];

    public addInsertBan(ban: Champion): BulkOperationBuilder{
        this.operations.push({
            updateOne: {
                filter: { "champion.id": ban.id },
                update: { 
                    $setOnInsert: { champion: ban },
                    $inc: { bans: 1 }
                },
                upsert: true
            }
        });
        return this;
    }

    public addInsertSummonerStats(performance: PerformanceStats, won: boolean, minutesPlayed: number): BulkOperationBuilder{
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
                filter: { "summoner.id": performance.summoner.id },
                update: {
                    $setOnInsert: {
                        summoner: performance.summoner,
                        picks: []
                    },
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
                    "summoner.id": summoner.id,
                    "picks.champion.id": { $ne: champion.id }
                },
                update: {
                    $push: {
                        picks: { champion }
                    } as PushOperator<Document>
                }
            }
        }
    }

    private createIncrementPickOperation(summoner: Summoner, champion: Champion): AnyBulkWriteOperation{
        return {
            updateOne: {
                filter: {
                    "summoner.id": summoner.id,
                    "picks.champion.id": champion.id
                },
                update: {
                    $inc: { "picks.$.count": 1 }
                }
            }
        }
    }

    public addInsertChampionStats(performance: PerformanceStats, won: boolean, minutesPlayed: number): BulkOperationBuilder{
        this.operations.push({
            updateOne:{
                filter: { "champion.id": performance.champion.id },
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

    public build(): AnyBulkWriteOperation[]{
        return this.operations;
    }
}