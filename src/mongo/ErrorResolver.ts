import { BulkWriteResult, MongoServerError } from "mongodb";
import { Logger } from "../core/concretions/logging";
import { BotError, ErrorCode } from "../core/concretions";
import { IndexKey } from "./enums";

export class ErrorResolver{
    
    private static readonly DUPLICATE_KEY_ERROR_CODE: number = 11000;

    public createError(innerErrorMessage: string, code: ErrorCode = ErrorCode.DB_ERROR): BotError{
        const innerError: Error = new Error(innerErrorMessage);
        return new BotError(code, innerError);
    }

    public resolveUpsertAccountError(error: any): any{
        if(this.isErrorDuplicateKey(error, IndexKey.USER_ID))
            return new BotError(ErrorCode.ACCOUNT_USER_IN_DB);    
        else if(this.isErrorDuplicateKey(error, IndexKey.SUMMONER_ID))
            return new BotError(ErrorCode.ACCOUNT_SUMMONER_IN_DB);
        else
            return error;
    }

    public resolveInsertOngoingMatchError(error: any): any{
        if(this.isErrorDuplicateKey(error, IndexKey.ID))
            return new BotError(ErrorCode.ONGOING_MATCH_IN_DB)
        else
            return error;
    }

    public resolveCompletedMatchStatsInsertionErrors(insertionResults: PromiseSettledResult<BulkWriteResult>[]): void{
        Logger.logInformation(insertionResults.toString());
    }

    private isErrorDuplicateKey(error: any, key: IndexKey): boolean{
        return error instanceof MongoServerError &&
            error.code == ErrorResolver.DUPLICATE_KEY_ERROR_CODE &&
            error.errmsg.includes(key);
    }
}