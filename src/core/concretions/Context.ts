import { Predictor, Database, Message, Server, MatchFetcher, SummonerFetcher } from '../abstractions';

export interface Context{
    readonly summonerFetcher: SummonerFetcher,
    readonly matchFetcher: MatchFetcher,
    readonly predictor: Predictor,
    readonly database: Database,
    readonly server: Server,
    readonly message: Message,
}