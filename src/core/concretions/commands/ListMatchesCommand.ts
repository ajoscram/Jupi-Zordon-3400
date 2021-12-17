import { Command } from "../../abstractions";
import { Context } from "..";
import { OngoingMatch, ServerIdentity } from "../../../core/model";

export class ListMatchesCommand implements Command{
    public async execute(context: Context): Promise<void> {
        const serverIdentity: ServerIdentity = context.server.getIdentity();
        const matches: OngoingMatch[] = await context.database.getOngoingMatches(serverIdentity);
        await context.message.replyWithRecordedMatches(matches);
    }
}