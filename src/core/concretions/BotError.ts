import { ErrorCode } from ".";

export class BotError extends Error{
    constructor(
        public readonly code: ErrorCode,
        public readonly inner?: Error
    ){
        super("BotError Code: " + ErrorCode[code]);
    }
}