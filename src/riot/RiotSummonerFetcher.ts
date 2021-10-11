import { Summoner } from "../core/model";
import { SummonerFetcher } from "../core/abstractions";
import { RawSummoner } from "./riotInterfaces";
import { HttpClient } from "./HttpClient";

export class RiotSummonerFetcher implements SummonerFetcher {

    private readonly summonerUrl:string = "https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name";

    constructor(private readonly httpClient:HttpClient){
         
    };

    public async getSummoner(name: string): Promise<Summoner> {
        //const safe_name  = 
        const requestUrl:string = this.summonerUrl +  "/" + name;
        const requestHeader:object = {headers : { "X-Riot-Token": process.env.RIOT_API_KEY } };        
        const rawSummoner:RawSummoner = await this.httpClient.get(requestUrl, requestHeader ) as RawSummoner;
        return {
                    name:rawSummoner.name, 
                    id:rawSummoner.accountId
                };
    }

}