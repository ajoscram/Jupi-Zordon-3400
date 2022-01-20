import { Message } from ".";
import { CompletedMatch, OngoingMatch } from "../model";

export interface CompletedMatchFetcher{
    getCompletedMatches(ongoingMatches: OngoingMatch[], message?: Message): Promise<CompletedMatch[]>;
}