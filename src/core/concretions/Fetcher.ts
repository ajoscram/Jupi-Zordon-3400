import { ChampionFetcher, MatchFetcher, SummonerFetcher } from "../abstractions";
import { CompletedMatch, OngoingMatch, Server, Summoner } from "../model";

export class Fetcher{
    constructor(
        private championFetcher: ChampionFetcher,
        private summonerFetcher: SummonerFetcher,
        private matchFetcher: MatchFetcher
    ){}

    public async getSummoner(summonerName: string): Promise<Summoner>{
        return this.summonerFetcher.getSummoner(summonerName);
    }

    public async getOngoingMatch(summoner: Summoner, server: Server): Promise<OngoingMatch>{
        return this.matchFetcher.getOngoingMatch(summoner, server);
    }

    public async getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch>{
        return this.matchFetcher.getCompletedMatch(ongoingMatch);
    }
}