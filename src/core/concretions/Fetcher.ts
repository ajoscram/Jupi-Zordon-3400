import { ChampionFetcher, MatchFetcher, SummonerFetcher } from "../abstractions";
import { CompletedMatch, OngoingMatch, Summoner } from "../model";

export class Fetcher{
    constructor(
        public championFetcher: ChampionFetcher,
        public summonerFetcher: SummonerFetcher,
        public matchFetcher: MatchFetcher
    ){}

    public getSummoner(summonerName: string): Summoner{
        return this.summonerFetcher.getSummoner(summonerName);
    }

    public getOngoingMatch(summoner: Summoner): OngoingMatch{
        return this.matchFetcher.getOngoingMatch(summoner);
    }

    public getCompletedMatch(ongoingMatch: OngoingMatch): CompletedMatch{
        return this.matchFetcher.getCompletedMatch(ongoingMatch);
    }
}