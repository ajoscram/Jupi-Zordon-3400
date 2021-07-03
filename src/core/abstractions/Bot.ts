import { Command } from ".";
import { Context } from "../concretions";
import { CommandFactory } from "../concretions/util";
import { Message } from "./Message";

export abstract class Bot{
    private commandFactory: CommandFactory;

    public Bot(commandIdentifier: string){
        this.commandFactory = new CommandFactory(commandIdentifier);
    }

    public abstract run(): Promise<void>;
    protected abstract getContext(message: Message): Context;

    protected async OnMessage(message: Message): Promise<void>{
        const command: Command = this.commandFactory.tryCreateCommand(message);
        if(command){
            const context: Context = this.getContext(message);
            command.execute(context);
        }
    }
}