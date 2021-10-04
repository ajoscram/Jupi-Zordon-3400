import { Command, Message, CommandFactory } from ".";
import { Context, BotError, ErrorCode } from "../concretions";
import { Logger } from "../concretions/logging";

export abstract class Bot{
    constructor(
        private readonly commandFactory: CommandFactory
    ){}

    public abstract initialize(): Promise<void>;
    public abstract run(): Promise<void>;
    protected abstract getContext(message: Message): Context;

    protected async process(message: Message): Promise<void>{
        try{
            const command: Command | null = this.commandFactory.tryCreateCommand(message);
            const context: Context = this.getContext(message);
            await command?.execute(context);
        }
        catch(error){
            this.handleError(error, message);
        }
    }

    private handleError(error: any, message: Message): void {
        if(!(error instanceof Error))
            error = new Error("Someone was stupid enough to throw this: " + error);

        if(!(error instanceof BotError))
            error = new BotError(ErrorCode.UNKNOWN, error);

        Logger.logError(error.inner?.message);
        message.replyWithError(error.code);
    }
}