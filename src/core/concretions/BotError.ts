export class BotError extends Error{
    constructor(
        public readonly code: ErrorCode,
        public readonly inner?: Error
    ){
        super("BotError Code: " + ErrorCode[code]);
    }
}

export enum ErrorCode{
    UNKNOWN,
    COMMAND_ARGUMENT_COUNT,
    COMMAND_QUOTE_NOT_MATCHED,
    USER_NOT_FOUND,
    CHANNEL_NOT_FOUND,
    CHANNEL_IS_NOT_VOICE,
    CHANNEL_IS_NOT_TEXT,
    USER_NOT_IN_A_VOICE_CHANNEL,
    NOT_IN_A_SERVER,
    ACCOUNT_NOT_FOUND,
    ACCOUNTS_NOT_FOUND,
    ACCOUNT_USER_ID_IN_DB,
    ACCOUNT_SUMMONER_ID_IN_DB,
    SUMMONER_STATS_NOT_FOUND,
    DB_ERROR,
    ONGOING_MATCH_IS_NOT_CUSTOM,
    UNSUCCESSFUL_REQUEST,
    MISSING_MATCH_DATA,
    UNKNOWN_CHAMPION_ID
}