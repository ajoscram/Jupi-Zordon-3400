import { SummonerFetcher } from "src/core/abstractions";
import { Summoner } from "src/core/model";

export class MockSummonerFetcher implements SummonerFetcher {

    public async getSummoner(name: string): Promise<Summoner> {

        return { id: "SUMM666", name };
        
    }

}
