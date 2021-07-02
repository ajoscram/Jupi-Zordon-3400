import { Context, Fetcher } from "../core/concretions";
import { Database, MatchFetcher, Message, Predictor, Server, SummonerFetcher } from "../core/abstractions";

export class ContextBuilder{
    private predictor: Predictor;
    private database: Database;
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

    public build(server: Server, message: Message): Context{
        const fetcher: Fetcher = new Fetcher(
            this.summonerFetcher,
            this.matchFetcher
        );
        return new Context(fetcher, this.predictor, this.database, server, message);
    }
}