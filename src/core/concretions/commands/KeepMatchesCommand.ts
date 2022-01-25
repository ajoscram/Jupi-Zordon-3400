import { Command, Message, Source } from "../../interfaces";
import { AttachmentSource, Context } from "..";
import { CommandUtils } from "./CommandUtils";
import { Attachment, CompletedMatch, OngoingMatch } from "../../model";

export class KeepMatchesCommand implements Command{

    private readonly matchIndex: number;

    constructor(options: string[]){
        CommandUtils.validateOptionsLength(options, [ 0, 1 ]);
        if(options[0])
            this.matchIndex = CommandUtils.parseIndex(options[0]);
    }

    public async execute(context: Context): Promise<void> {
        const ongoingMatches: OngoingMatch[] = await CommandUtils.getOngoingMatches(context, this.matchIndex);
        const source: Source | undefined = this.tryGetSource(context.message);
        const completedMatches: CompletedMatch[] = await context.matchFetcher.getCompletedMatches(ongoingMatches, source);

        await context.database.insertCompletedMatches(completedMatches);
        await context.database.deleteOngoingMatches(ongoingMatches);
        await context.message.replyWithKeptMatches(completedMatches);
    }

    private tryGetSource(message: Message): Source | undefined {
        const attachments: Attachment[] = message.getAttachments();
        if(attachments.length > 0)
            return new AttachmentSource(attachments);
        else
            return undefined;
    }
}