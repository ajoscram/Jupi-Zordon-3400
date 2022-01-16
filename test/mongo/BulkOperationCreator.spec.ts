import "jasmine";
import { AnyBulkWriteOperation, PushOperator } from "mongodb";
import { Champion, ChampionOverallStats, CompletedMatch, PerformanceStats, SummonerOverallStats } from "../../src/core/model";
import { DummyModelFactory } from "../../test/utils";
import { BulkOperationCreator } from "../../src/mongo/BulkOperationCreator";
import { IndexKey } from "../../src/mongo/enums";

describe('BulkOperationCreator', () => {

    const creator: BulkOperationCreator = new BulkOperationCreator();
    const match: CompletedMatch = new DummyModelFactory().createCompletedMatch();

    it('createInsertSummonerStatsOperations(): ', async () => {
        const operations: AnyBulkWriteOperation<SummonerOverallStats>[] =
            creator.createInsertSummonerStatsOperations([match]);
    
        let i = 0;
        for(const performance of match.blue.performanceStats){
            validateSummonerStatsOperation(operations[i++], performance, match.blue.won);
            validatePickOperation(operations[i++], performance);
            validateIncrementPickOperation(operations[i++], performance);
        }

        for(const performance of match.red.performanceStats){
            validateSummonerStatsOperation(operations[i++], performance, match.red.won);
            validatePickOperation(operations[i++], performance);
            validateIncrementPickOperation(operations[i++], performance);
        }
    });

    it('createInsertChampionStatsOperations(): ', async () => {
        const operations: AnyBulkWriteOperation<ChampionOverallStats>[] =
            creator.createInsertChampionStatsOperations([match]);
        
        let i = 0;
        for(const ban of match.blue.bans)
            validateInsertBanOperation(operations[i++], ban);
        for(const performance of match.blue.performanceStats)
            validateChampionStatsOperation(operations[i++], performance, match.blue.won);
        
        for(const ban of match.red.bans)
            validateInsertBanOperation(operations[i++], ban);
        for(const performance of match.red.performanceStats)
            validateChampionStatsOperation(operations[i++], performance, match.red.won);
    });

    function validateSummonerStatsOperation(
        operation: AnyBulkWriteOperation<SummonerOverallStats>,
        performance: PerformanceStats,
        won: boolean): void {
        expect(operation).toEqual({
            updateOne: {
                filter: { [IndexKey.SUMMONER_ID]: performance.summoner.id },
                update: {
                    $set: { summoner: performance.summoner },
                    $setOnInsert: { picks: [] },
                    $inc: {
                        wins: won ? 1 : 0,
                        losses: won ? 0 : 1,
                        minutesPlayed: match.minutesPlayed,
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
                        pentakills: performance.pentakills
                    }
                },
                upsert: true
            }
        });
    }

    function validatePickOperation(
        operation: AnyBulkWriteOperation<SummonerOverallStats>,
        performance: PerformanceStats): void {
        expect(operation).toEqual({
            updateOne: {
                filter: {
                    [IndexKey.SUMMONER_ID]: performance.summoner.id,
                    [IndexKey.PICKS_CHAMPION_ID]: { $ne: performance.champion.id }
                },
                update: {
                    $push: {
                        picks: { champion: performance.champion }
                    } as PushOperator<Document>
                }
            }
        });
    }

    function validateIncrementPickOperation(
        operation: AnyBulkWriteOperation<SummonerOverallStats>,
        performance: PerformanceStats): void {
        expect(operation).toEqual({
            updateOne: {
                filter: {
                    [IndexKey.SUMMONER_ID]: performance.summoner.id,
                    [IndexKey.PICKS_CHAMPION_ID]: performance.champion.id
                },
                update: {
                    $inc: { "picks.$.count": 1 }
                }
            }
        });
    }

    function validateInsertBanOperation(
        operation: AnyBulkWriteOperation<ChampionOverallStats>,
        ban: Champion): void{
        expect(operation).toEqual({
            updateOne: {
                filter: { [IndexKey.CHAMPION_ID]: ban.id },
                update: { 
                    $setOnInsert: { champion: ban },
                    $inc: { bans: 1 }
                },
                upsert: true
            }
        });
    }

    function validateChampionStatsOperation(
        operation: AnyBulkWriteOperation<ChampionOverallStats>,
        performance: PerformanceStats,
        won: boolean): void {
        expect(operation).toEqual({
            updateOne: {
                filter: { [IndexKey.CHAMPION_ID]: performance.champion.id },
                update: {
                    $setOnInsert: { champion: performance.champion },
                    $inc: {
                        picks: 1,
                        wins: won ? 1 : 0,
                        losses: won ? 0 : 1,
                        minutesPlayed: match.minutesPlayed,
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
                        pentakills: performance.pentakills
                    }
                },
                upsert: true
            }
        });
    }
});