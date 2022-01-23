import { CompletedMatch, OngoingMatch, ServerIdentity, Summoner } from "../model";
import { Source } from "./Source";

export interface MatchFetcher{
    getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch>;
    getCompletedMatches(ongoingMatches: OngoingMatch[], source?: Source): Promise<CompletedMatch[]>;
}