import { Context } from "..";
import { Command } from "../../interfaces";

export class HelpCommand implements Command {
    public async execute(context: Context): Promise<void> {
        await context.message.replyWithHelp();
    }
}