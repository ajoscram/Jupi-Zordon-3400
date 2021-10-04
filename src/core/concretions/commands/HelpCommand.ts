import { Context } from "..";
import { Command } from "../../abstractions";

export class HelpCommand implements Command {
    public async execute(context: Context): Promise<void> {
        context.message.replyWithHelp();
    }
}