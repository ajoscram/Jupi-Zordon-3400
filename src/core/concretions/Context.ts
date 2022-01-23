import { Predictor, Database, Message, Server, SummonerFetcher, MatchFetcher, } from '../interfaces';

export interface Context{
    readonly predictor: Predictor,
    readonly database: Database,
    readonly server: Server,
    readonly message: Message,
    readonly summonerFetcher: SummonerFetcher,
    readonly matchFetcher: MatchFetcher,
}