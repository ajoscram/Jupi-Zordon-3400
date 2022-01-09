import { Summoner } from "../core/model";
import { SummonerFetcher } from "../core/abstractions";
import { RawSummoner } from "./model";
import { Header, HttpClient } from "./http";
import { createRiotTokenHeader, Url } from "./utils";

export class RiotSummonerFetcher implements SummonerFetcher {

    constructor(
        private readonly client: HttpClient
    ){ };

    public async getSummoner(name: string): Promise<Summoner> {
        const requestUrl: string = Url.SUMMONER + encodeURIComponent(name);
        const header: Header = createRiotTokenHeader(); 
        const rawSummoner: RawSummoner = await this.client.get(requestUrl, [ header ]) as RawSummoner;
        return {
            name: rawSummoner.name, 
            id: rawSummoner.accountId
        };
    }

}