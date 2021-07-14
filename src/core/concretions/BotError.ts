export class BotError extends Error{
    constructor(
        public readonly code: ErrorCode,
        public readonly inner?: Error
    ){
        super("BotError Code: " + code);
    }
}

export enum ErrorCode{
    UNKNOWN,
    USER_NOT_FOUND,
    CHANNEL_NOT_FOUND,
    CHANNEL_IS_NOT_VOICE,
    USER_NOT_IN_A_VOICE_CHANNEL
}