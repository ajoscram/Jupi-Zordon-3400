import { Command, Message } from ".";
import { Context } from "../concretions";
import { CommandFactory } from "../concretions/commands/creation";

export abstract class Bot{
    private commandFactory: CommandFactory;

    public Bot(commandIdentifier: string){
        this.commandFactory = new CommandFactory(commandIdentifier);
    }

    public abstract initialize(): Promise<void>;
    public abstract run(): Promise<void>;

    protected abstract getContext(message: Message): Context;

    protected async processMessage(message: Message): Promise<void>{
        const command: Command = this.commandFactory.tryCreateCommand(message);
        if(command){
            const context: Context = this.getContext(message);
            command.execute(context);
        }
    }
}