import { Command } from "../../abstractions";
import { Context } from "..";
import { CommandUtils } from "./CommandUtils";
import { OngoingMatch } from "../../../core/model";

export class DiscardMatchesCommand implements Command{

    private readonly matchIndex?: number;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [ 0, 1 ]);
        if(options[0])
            this.matchIndex = CommandUtils.parseIndex(options[0]);
    }

    public async execute(context: Context): Promise<void> {
        const matches: OngoingMatch[] = await CommandUtils.getOngoingMatches(context, this.matchIndex);
        await context.database.deleteOngoingMatches(matches);
        await context.message.replyWithDiscardedMatches(matches);
    }
}