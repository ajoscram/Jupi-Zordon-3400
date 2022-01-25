import { BotError, ErrorCode } from "../core/concretions";
import { RawOngoingMatch, RawCompletedMatch, TeamId, RawRole, RawLane } from "./model";

export abstract class Validate{

    private static readonly CUSTOM_GAME_TYPE: string = "CUSTOM_GAME";
    private static readonly PRACTICE_TOOL_GAME_MODE: string = "PRACTICETOOL";

    public static rawOngoingMatch(obj: any): obj is RawOngoingMatch {
        if(!Validate.properties<RawOngoingMatch>(obj, Validate.RAW_ONGOING_MATCH_SCHEMA))
            return false;
        else if(obj.gameType !== Validate.CUSTOM_GAME_TYPE)
            throw new BotError(ErrorCode.ONGOING_MATCH_IS_NOT_CUSTOM);
        else if(obj.gameMode === Validate.PRACTICE_TOOL_GAME_MODE)
            throw new BotError(ErrorCode.ONGOING_MATCH_IS_PRACTICE_TOOL);
        
        return true;
    }

    public static rawCompletedMatch(obj: any): obj is RawCompletedMatch{
        return Validate.properties<RawCompletedMatch>(obj, Validate.RAW_COMPLETED_MATCH_SCHEMA);
    }

    private static properties<T>(obj: any, schema: any, trace: string[] = []): obj is T {
        Validate.types(obj, schema, trace);
        if(Array.isArray(schema))
            for(let i = 0; i < obj.length; i++)
                Validate.properties(obj[i], schema[0], trace.concat(i.toString()));
        else if(typeof schema === "object")
            for(const key of Object.keys(schema))
                Validate.properties(obj[key], schema[key], trace.concat(key));
        return true;
    }

    private static types(obj: any, schema: any, trace: string[]): void {
        if(
            ((schema !== null && schema !== undefined) && (obj === null || obj === undefined)) ||
            typeof schema !== typeof obj ||
            (Array.isArray(schema) && !Array.isArray(obj))
        ){
            const innerError: Error = new Error("Failed object validation at " + trace.join("."));
            throw new BotError(ErrorCode.TYPE_ASSERTION_FAILED, innerError);
        }
    }

    private static readonly RAW_ONGOING_MATCH_SCHEMA: RawOngoingMatch = {
        gameId: 1,
        gameMode: "s",
        gameType: "s",
        platformId: "s",
        gameStartTime: 1,
        participants: [
            {
                teamId: TeamId.BLUE,
                championId: 1,
                summonerId: "s",
                summonerName: "s"
            }
        ],
        bannedChampions: [
            {
                championId: 1,
                teamId: TeamId.BLUE
            }
        ]
    }

    private static readonly RAW_COMPLETED_MATCH_SCHEMA: RawCompletedMatch = {
        gameId: 1,
        gameMode: "s",
        gameType: "s",
        platformId: "s",
        gameCreation: 1,
        gameDuration: 1,
        teams: [
            {
                teamId: TeamId.RED,
                win: "s",
                towerKills: 1,
                baronKills: 1,
                dragonKills: 1,
                riftHeraldKills: 1
            }
        ],
        participants: [
            {
                teamId: TeamId.BLUE,
                championId: 1,
                participantId: 1,
                stats: {
                    kills: 1,
                    deaths: 1,
                    assists: 1,
                    largestKillingSpree: 1,
                    largestMultiKill: 1,
                    pentaKills: 1,
                    totalDamageDealtToChampions: 1,
                    damageDealtToObjectives: 1,
                    visionScore: 1,
                    timeCCingOthers: 1,
                    totalDamageTaken: 1,
                    goldEarned: 1,
                    totalMinionsKilled: 1,
                    neutralMinionsKilled: 1,
                    firstBloodKill: true,
                    firstTowerKill: true,
                    timeline: {
                        role: RawRole.SOLO,
                        lane: RawLane.BOTTOM
                    }
                }
            }
        ]   
    }
}