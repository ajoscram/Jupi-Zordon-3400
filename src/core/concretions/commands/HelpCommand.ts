import { Context } from "..";
import { Command } from "../../abstractions";

export class HelpCommand implements Command {
    public async execute(context: Context): Promise<void> {
        await context.message.replyWithHelp();
    }
}