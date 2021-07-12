import { Command, Message } from ".";
import { BotError, Context } from "../concretions";
import { CommandFactory } from "../concretions/commands/creation";

export abstract class Bot{
    private commandFactory: CommandFactory;

    public Bot(commandIdentifier: string){
        this.commandFactory = new CommandFactory(commandIdentifier);
    }

    public abstract initialize(): Promise<void>;
    public abstract run(): Promise<void>;

    protected abstract getContext(message: Message): Context;
    protected abstract handleUnknownError(error: Error): BotError;

    protected processMessage(message: Message): void{
        const command: Command = this.commandFactory.tryCreateCommand(message);
        if(command){
            const context: Context = this.getContext(message);
            command?.execute(context).catch((error) => { this.handleError(error, message) });
        }
    }

    private handleError(error: any, message: Message): void{
        if(!(error instanceof Error))
            error = new Error("Someone was stupid enough to throw this: " + error);

        if(!(error instanceof BotError))
            error = this.handleUnknownError(error);

        message.sendError(error);
    }
}