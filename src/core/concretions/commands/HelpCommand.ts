import { Context } from "..";
import { Command } from "../../abstractions";

export class HelpCommand implements Command{

    constructor(){ }

    public async execute(context: Context): Promise<void> {
        context.message.sendHelp();
    }
}