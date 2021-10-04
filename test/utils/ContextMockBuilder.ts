import { Database, MatchFetcher, Message, Predictor, Server, SummonerFetcher } from "../../src/core/abstractions";
import { Context } from "../../src/core/concretions";
import { IMock, Mock } from "typemoq";

export class ContextMockBuilder{

    public readonly predictorMock: IMock<Predictor> = Mock.ofType<Predictor>();
    public readonly summonerFetcherMock: IMock<SummonerFetcher> = Mock.ofType<SummonerFetcher>();
    public readonly matchFetcherMock: IMock<MatchFetcher> = Mock.ofType<MatchFetcher>();
    public readonly serverMock: IMock<Server> = Mock.ofType<Server>();
    public readonly databaseMock: IMock<Database> = Mock.ofType<Database>();
    public readonly messageMock: IMock<Message> = Mock.ofType<Message>();

    public readonly context: Context = {
        message: this.messageMock.object,
        predictor: this.predictorMock.object,
        summonerFetcher: this.summonerFetcherMock.object,
        matchFetcher: this.matchFetcherMock.object,
        server: this.serverMock.object,
        database: this.databaseMock.object
    }
}