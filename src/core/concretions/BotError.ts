export class BotError extends Error{
    constructor(
        message: string,
        public inner?: Error
    ){
        super(message);
    }
}