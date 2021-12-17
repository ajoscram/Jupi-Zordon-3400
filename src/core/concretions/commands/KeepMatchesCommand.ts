import { Command } from "../../abstractions";
import { Context } from "..";
import { CommandUtils } from "./CommandUtils";
import { CompletedMatch, OngoingMatch } from "../../../core/model";

export class KeepMatchesCommand implements Command{

    private readonly utils: CommandUtils;
    private readonly matchIndex: number;

    constructor(options: string[]){
        this.utils = new CommandUtils();
        this.utils.validateOptionsLength(options, [ 0, 1 ]);
        this.matchIndex = Number.parseInt(options[0]);
    }

    public async execute(context: Context): Promise<void> {
        const ongoingMatches: OngoingMatch[] = await this.utils.getOngoingMatches(context, this.matchIndex);
        const completedMatches: CompletedMatch[] = [];
        for(const ongoingMatch of ongoingMatches){
            const completedMatch: CompletedMatch = await context.matchFetcher.getCompletedMatch(ongoingMatch);
            await context.database.insertCompletedMatch(completedMatch);
            completedMatches.push(completedMatch);
        }
        await context.message.replyWithKeptMatches(completedMatches);
    }
}