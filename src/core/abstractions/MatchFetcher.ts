import { Message } from ".";
import { CompletedMatch, OngoingMatch, ServerIdentity, Summoner } from "../model";

export interface MatchFetcher{
    getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch>;
    getCompletedMatches(ongoingMatches: OngoingMatch[], message?: Message): Promise<CompletedMatch[]>;
}