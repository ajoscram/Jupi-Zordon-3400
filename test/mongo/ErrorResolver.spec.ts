import "jasmine";
import { MongoServerError } from "mongodb";
import { IndexKey } from "../../src/mongo/enums";
import { BotError, ErrorCode } from "../../src/core/concretions";
import { ErrorResolver } from "../../src/mongo/ErrorResolver";

describe('ErrorResolver', () => {

    const resolver: ErrorResolver = new ErrorResolver();

    it('createError(): returns a bot error with the expected information', async () => {
        const message: string = "inner error message";
        const code: ErrorCode = ErrorCode.ACCOUNTS_NOT_FOUND;

        const error: BotError = resolver.createError(message, code);
        
        expect(error.code).toBe(code);
        expect(error.inner?.message).toBe(message);
    });

    it('handleUpsertAccountError(): should return an "already registered" BotError given a duplicate key mongo error with the user id index key', async () => {
        const mongoError: MongoServerError = createDuplicateKeyError(IndexKey.USER_ID);

        const botError: any = resolver.resolveUpsertAccountError(mongoError);

        expect(botError).toBeInstanceOf(BotError);
        expect(botError.code).toBe(ErrorCode.ACCOUNT_USER_IN_DB);
    });

    it('handleUpsertAccountError(): should return an "already registered" BotError given a duplicate key mongo error with the summoner id index key', async () => {
        const mongoError: MongoServerError = createDuplicateKeyError(IndexKey.SUMMONER_ID);
        
        const botError: any = resolver.resolveUpsertAccountError(mongoError);

        expect(botError).toBeInstanceOf(BotError);
        expect(botError.code).toBe(ErrorCode.ACCOUNT_SUMMONER_IN_DB);
    });
    
    it('handleUpsertAccountError(): returns the same error if it doesnt fit any criteria', async () => {
        const expectedError: any = "not a recognized error";

        const actualError: any = resolver.resolveUpsertAccountError(expectedError);

        expect(actualError).toBe(expectedError);
    });

    it('handleInsertOngoingMatchError(): should return an "already registered" BotError given a duplicate key mongo error with the id index key', async () => {
        const mongoError: MongoServerError = createDuplicateKeyError(IndexKey.ID);
        
        const botError: any = resolver.resolveInsertOngoingMatchError(mongoError);

        expect(botError).toBeInstanceOf(BotError);
        expect(botError.code).toBe(ErrorCode.ONGOING_MATCH_IN_DB);
    });

    it('handleInsertOngoingMatchError(): returns the same error if it doesnt fit any criteria', async () => {
        const expectedError: any = "not a recognized error";

        const actualError: any = resolver.resolveInsertOngoingMatchError(expectedError);

        expect(actualError).toBe(expectedError);
    });

    function createDuplicateKeyError(key: IndexKey): MongoServerError{
        const error: MongoServerError = new MongoServerError({ errmsg: key  });
        error.code = 11000; //Duplicate key error code
        return error;
    }
    
});