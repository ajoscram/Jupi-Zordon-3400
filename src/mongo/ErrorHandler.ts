import { MongoServerError } from "mongodb";
import { BotError, ErrorCode } from "../../src/core/concretions";
import { IndexKey } from "./enums";

export class ErrorHandler{
    
    public static readonly DUPLICATE_KEY_ERROR_CODE: number = 11000;

    public createError(innerErrorMessage: string, code: ErrorCode = ErrorCode.DB_ERROR): BotError{
        const innerError: Error = new Error(innerErrorMessage);
        return this.handleGenericError(innerError, code);
    }

    public throwIfFalsy(object: any, code: ErrorCode = ErrorCode.DB_ERROR): void{
        if(!object)
            throw new BotError(code);
    }

    public handleUpsertAccountError(error: any): BotError{
        if(this.isErrorDuplicateKey(error, IndexKey.USER_ID))
            return new BotError(ErrorCode.ACCOUNT_USER_ID_IN_DB);    
        else if(this.isErrorDuplicateKey(error, IndexKey.SUMMONER_ID))
            return new BotError(ErrorCode.ACCOUNT_SUMMONER_ID_IN_DB);
        else
            return this.handleGenericError(error);
    }

    private isErrorDuplicateKey(error: any, key: string): boolean{
        return error instanceof MongoServerError &&
            error.code == ErrorHandler.DUPLICATE_KEY_ERROR_CODE &&
            error.errmsg.includes(key);
    }

    private handleGenericError(error: any, code: ErrorCode = ErrorCode.DB_ERROR): BotError{
        if(error instanceof BotError)
            return error;
        if(!(error instanceof Error))
            error = new Error(error);
        return new BotError(code, error);
    }
}