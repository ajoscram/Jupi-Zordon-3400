import { Context, Fetcher } from "../core/concretions";
import { ChampionFetcher, Database, MatchFetcher, Message, Predictor, SummonerFetcher } from "../core/abstractions";

export class ContextBuilder{
    private predictor: Predictor;
    private database: Database;
    private championFetcher: ChampionFetcher;
    private matchFetcher: MatchFetcher;
    private summonerFetcher: SummonerFetcher;

    public setPredictor(predictor: Predictor): ContextBuilder{
        this.predictor = predictor;
        return this;
    }

    public setDatabase(database: Database): ContextBuilder{
        this.database = database;
        return this;
    }

    public setMatchFetcher(matchFetcher: MatchFetcher): ContextBuilder{
        this.matchFetcher = matchFetcher;
        return this;
    }

    public setSummonerFetcher(summonerFetcher: SummonerFetcher): ContextBuilder{
        this.summonerFetcher = summonerFetcher;
        return this;
    }

    public setChampionFetcher(championFetcher: ChampionFetcher): ContextBuilder{
        this.championFetcher = championFetcher;
        return this;
    }

    public build(message: Message): Context{
        const fetcher: Fetcher = new Fetcher(
            this.championFetcher,
            this.summonerFetcher,
            this.matchFetcher
        );
        return new Context(fetcher, this.predictor, this.database, message);
    }
}