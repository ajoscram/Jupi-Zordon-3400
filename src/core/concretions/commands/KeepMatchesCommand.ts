import { Command } from "../../abstractions";
import { Context } from "..";
import { CommandUtils } from "./CommandUtils";
import { CompletedMatch, OngoingMatch } from "../../../core/model";

export class KeepMatchesCommand implements Command{

    private readonly matchIndex: number;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [ 0, 1 ]);
        if(options[0])
            this.matchIndex = CommandUtils.parseIndex(options[0]);
    }

    public async execute(context: Context): Promise<void> {
        const ongoingMatches: OngoingMatch[] = await CommandUtils.getOngoingMatches(context, this.matchIndex);
        const completedMatches: CompletedMatch[] = await context.matchFetcher.getCompletedMatches(ongoingMatches);

        await context.database.insertCompletedMatches(completedMatches);
        await context.database.deleteOngoingMatches(ongoingMatches);
        await context.message.replyWithKeptMatches(completedMatches);
    }
}