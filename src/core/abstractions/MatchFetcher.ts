import { CompletedMatch, OngoingMatch, Summoner } from "../model";

export interface MatchFetcher{
    getOngoingMatch(summoner: Summoner): OngoingMatch;
    getCompletedMatch(ongoingMatch: OngoingMatch): CompletedMatch;
}