import { MatchFetcher } from "src/core/abstractions";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch } from "src/core/model";

export class MockMatchFetcher implements MatchFetcher {

    public async getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch> {
        throw new Error("Method not implemented.");
    }
    public async getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch> {
        throw new Error("Method not implemented.");
    }
    

}