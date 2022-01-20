import { CompletedMatchFetcher, Message } from "src/core/abstractions";
import { OngoingMatch, CompletedMatch } from "src/core/model";

export class DiscordMatchFetcher implements CompletedMatchFetcher{
    public async getCompletedMatches(ongoingMatches: OngoingMatch[], message?: Message): Promise<CompletedMatch[]> {
        throw new Error("Method not implemented.");
    }
}