import { Summoner } from "../model";

export interface SummonerFetcher{
    getSummoner(summonerName: string): Summoner;
}