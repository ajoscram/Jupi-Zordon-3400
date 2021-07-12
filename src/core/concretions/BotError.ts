export class BotError extends Error{
    constructor(
        message: string,
        public readonly inner?: Error
    ){
        super(message);
    }
}