import { BulkWriteResult, MongoError, MongoServerError } from "mongodb";
import { BotError, ErrorCode } from "../../src/core/concretions";
import { MongoDao } from "./dao";
import { IndexKey } from "./enums";

export class ErrorHandler{
    
    public static readonly DUPLICATE_KEY_ERROR_CODE: number = 11000;

    public createError(innerErrorMessage: string, code: ErrorCode = ErrorCode.DB_ERROR): BotError{
        const innerError: Error = new Error(innerErrorMessage);
        return new BotError(code, innerError);
    }

    public handleUpsertAccountError(error: any): any{
        if(this.isErrorDuplicateKey(error, IndexKey.USER_ID))
            return new BotError(ErrorCode.ACCOUNT_USER_ID_IN_DB);    
        else if(this.isErrorDuplicateKey(error, IndexKey.SUMMONER_ID))
            return new BotError(ErrorCode.ACCOUNT_SUMMONER_ID_IN_DB);
        else
            return error;
    }

    public handleGetAccountsError(error: any): any{
        if(error instanceof MongoError && error.message === MongoDao.CURSOR_COUNT_MISMATCH_ERROR_MESSAGE)
            return new BotError(ErrorCode.ACCOUNTS_NOT_FOUND);
        else
            return error;
    }

    public throwIfFalsy(object: any, code: ErrorCode = ErrorCode.DB_ERROR): void{
        if(!object)
            throw new BotError(code);
    }

    public throwIfCompletedMatchStatsInsertionErrors(insertionResults: PromiseSettledResult<BulkWriteResult>[]): void{
        console.log(insertionResults);
    }

    private isErrorDuplicateKey(error: any, key: IndexKey): boolean{
        return error instanceof MongoServerError &&
            error.code == ErrorHandler.DUPLICATE_KEY_ERROR_CODE &&
            error.errmsg.includes(key);
    }
}