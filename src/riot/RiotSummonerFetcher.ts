import { Summoner } from "../core/model";
import { SummonerFetcher } from "../core/abstractions";
import { RawSummoner } from "./model";
import { Header, HttpClient } from "./http";
import { createRiotTokenHeader } from "./utils";

export class RiotSummonerFetcher implements SummonerFetcher {

    public static readonly SUMMONER_URL: string = "https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";

    constructor(
        private readonly client: HttpClient
    ){ };

    public async getSummoner(name: string): Promise<Summoner> {
        const urlSafeName: string = encodeURIComponent(name);
        const requestUrl: string = RiotSummonerFetcher.SUMMONER_URL + urlSafeName;
        const header: Header = createRiotTokenHeader(); 
        const rawSummoner: RawSummoner = await this.client.get(requestUrl, [ header ]) as RawSummoner;
        return {
            name: rawSummoner.name, 
            id: rawSummoner.accountId
        };
    }

}