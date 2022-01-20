import { OngoingMatch, ServerIdentity, Summoner } from "../model";

export interface OngoingMatchFetcher{
    getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch>;
}