import { Command } from "../../abstractions";
import { Context } from "..";
import { CommandUtils } from "./CommandUtils";
import { OngoingMatch } from "../../../core/model";

export class DiscardMatchesCommand implements Command{

    private readonly utils: CommandUtils;
    private readonly matchIndex: number;

    constructor(options: string[]){
        this.utils = new CommandUtils();
        this.utils.validateOptionsLength(options, [ 0, 1 ]);
        this.matchIndex = Number.parseInt(options[0]);
    }

    public async execute(context: Context): Promise<void> {
        const matches: OngoingMatch[] = await this.utils.getOngoingMatches(context, this.matchIndex);
        for(const match of matches)
            await context.database.deleteOngoingMatch(match);
        await context.message.replyWithDiscardedMatches(matches);
    }
}