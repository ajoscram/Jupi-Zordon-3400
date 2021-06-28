import { Summoner } from "../model";

export interface SummonerFetcher{
    getSummoner(name: string): Promise<Summoner>;
}