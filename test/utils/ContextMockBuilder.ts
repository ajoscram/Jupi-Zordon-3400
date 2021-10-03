import { Database, MatchFetcher, Message, Predictor, Server, SummonerFetcher } from "../../src/core/abstractions";
import { Context } from "../../src/core/concretions";
import { IMock, Mock } from "typemoq";

export class ContextMockBuilder{

    public readonly predictor: IMock<Predictor> = Mock.ofType<Predictor>();
    public readonly summonerFetcher: IMock<SummonerFetcher> = Mock.ofType<SummonerFetcher>();
    public readonly matchFetcher: IMock<MatchFetcher> = Mock.ofType<MatchFetcher>();
    public readonly server: IMock<Server> = Mock.ofType<Server>();
    public readonly database: IMock<Database> = Mock.ofType<Database>();
    public readonly message: IMock<Message> = Mock.ofType<Message>();

    public build(): Context{
        return {
            message: this.message.object,
            predictor: this.predictor.object,
            summonerFetcher: this.summonerFetcher.object,
            matchFetcher: this.matchFetcher.object,
            server: this.server.object,
            database: this.database.object
        }
    }
}