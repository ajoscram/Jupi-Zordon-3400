import { Context } from "../core/concretions";
import { Command } from "../core/abstractions";

export class HelpCommand extends Command{

    constructor(options: string[]){
        super(options);
    }

    public async execute(context: Context): Promise<void> {
        context.message.send("To view a list of commands you can execute on this bot visit https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands.");
    }
}