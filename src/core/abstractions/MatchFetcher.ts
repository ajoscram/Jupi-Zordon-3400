import { CompletedMatch, OngoingMatch, Server, Summoner } from "../model";

export interface MatchFetcher{
    getOngoingMatch(summoner: Summoner, server: Server): Promise<OngoingMatch>;
    getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch>;
}