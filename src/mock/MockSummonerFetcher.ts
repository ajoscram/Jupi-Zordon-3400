import { SummonerFetcher } from "src/core/interfaces";
import { Summoner } from "src/core/model";

export class MockSummonerFetcher implements SummonerFetcher {

    public async getSummoner(name: string): Promise<Summoner> {
        
        return { id: "SUMM666", name };

    }

}
