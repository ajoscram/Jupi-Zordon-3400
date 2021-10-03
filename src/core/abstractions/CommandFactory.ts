import { Command, Message } from ".";

export interface CommandFactory{
    tryCreateCommand(message: Message): Command | null;
}