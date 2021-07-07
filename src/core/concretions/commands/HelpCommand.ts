import { Context } from "..";
import { Command } from "../../abstractions";

export class HelpCommand implements Command{

    constructor(){ }

    public async execute(context: Context): Promise<void> {
        context.message.send("To view a list of commands you can execute on this bot visit https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands.");
    }
}