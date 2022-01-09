import { BulkWriteResult } from "mongodb";
import { BotError, ErrorCode } from "../core/concretions";

export class Thrower{

    private static readonly MAX_ONGOING_MATCHES_ALLOWED: number = 4;

    public throwIfFalsy(object: any, codeToThrow: ErrorCode = ErrorCode.DB_ERROR): void{
        if(!object)
            throw new BotError(codeToThrow);
    }

    public throwIfMaxMatchesReached(matchCount: number): void{
        if(matchCount >= Thrower.MAX_ONGOING_MATCHES_ALLOWED)
            throw new BotError(ErrorCode.MAX_ONGOING_MATCHES);
    }

    public throwIfAccountCountIsNotExpected(actualCount: number, expectedCount: number): void{
        if(actualCount !== expectedCount)
            throw new BotError(ErrorCode.ACCOUNTS_NOT_FOUND);
    }

    public throwIfOngoingMatchIndexIsOutOfRange(index: number, matchCount: number): void{
        if(index < 0 || index >= matchCount)
            throw new BotError(ErrorCode.ONGOING_MATCH_INDEX_OUT_OF_RANGE);
    }

    public throwIfCompletedMatchStatsInsertionErrors(insertionResults: PromiseSettledResult<BulkWriteResult>[]): void{
        console.log(insertionResults);
    }
}