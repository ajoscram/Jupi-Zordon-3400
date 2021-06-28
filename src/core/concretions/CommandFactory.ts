import { Command, Message } from "../abstractions";

export class CommandFactory{
    public createCommand(message: Message): Command{
        throw "not implemented";
    }
}