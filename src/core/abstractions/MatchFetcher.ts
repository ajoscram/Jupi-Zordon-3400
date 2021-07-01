import { CompletedMatch, OngoingMatch, ServerIdentity, Summoner } from "../model";

export interface MatchFetcher{
    getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch>;
    getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch>;
}