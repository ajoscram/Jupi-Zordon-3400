import { Summoner } from "../core/model";
import { SummonerFetcher } from "../core/abstractions";
import { RawSummoner } from "./model";
import { Header, HttpClient } from "../http";
import { Url } from "./Url";
import { RiotBaseFetcher } from "./RiotBaseFetcher";

export class RiotSummonerFetcher extends RiotBaseFetcher implements SummonerFetcher {

    constructor(
        private readonly client: HttpClient
    ){ super(); };

    public async getSummoner(name: string): Promise<Summoner> {
        const requestUrl: string = Url.SUMMONER + encodeURIComponent(name);
        const header: Header = this.createRiotTokenHeader(); 
        const rawSummoner: RawSummoner = await this.client.get(requestUrl, [ header ]);
        return {
            name: rawSummoner.name, 
            id: rawSummoner.id
        };
    }

}