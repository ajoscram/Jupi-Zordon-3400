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
    INDEX_NOT_NUMBER,
    USER_NOT_FOUND,
    CHANNEL_NOT_FOUND,
    CHANNEL_IS_NOT_VOICE,
    CHANNEL_IS_NOT_TEXT,
    USER_NOT_IN_A_VOICE_CHANNEL,
    NOT_IN_A_SERVER,
    ONGOING_MATCH_IS_NOT_CUSTOM,
    UNSUCCESSFUL_REQUEST,
    MISSING_MATCH_DATA,
    UNKNOWN_CHAMPION_ID,
    DB_ERROR,
    ACCOUNT_NOT_FOUND,
    ACCOUNTS_NOT_FOUND,
    ACCOUNT_USER_IN_DB,
    ACCOUNT_SUMMONER_IN_DB,
    SUMMONER_STATS_NOT_FOUND,
    MAX_ONGOING_MATCHES,
    ONGOING_MATCH_INDEX_OUT_OF_RANGE,
    ONGOING_MATCH_IN_DB,
}