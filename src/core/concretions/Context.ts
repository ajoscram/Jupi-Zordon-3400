import { Predictor, Database, Message, Server, CompletedMatchFetcher, SummonerFetcher, OngoingMatchFetcher } from '../abstractions';

export interface Context{
    readonly predictor: Predictor,
    readonly database: Database,
    readonly server: Server,
    readonly message: Message,
    readonly summonerFetcher: SummonerFetcher,
    readonly ongoingMatchFetcher: OngoingMatchFetcher,
    readonly completedMatchFetcher: CompletedMatchFetcher,
}