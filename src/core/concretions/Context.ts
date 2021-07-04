import { Predictor, Database, Message, Server, MatchFetcher, SummonerFetcher } from '../abstractions';
import { Logger } from './logging';

export interface Context{
    readonly logger: Logger;
    readonly summonerFetcher: SummonerFetcher,
    readonly matchFetcher: MatchFetcher,
    readonly predictor: Predictor,
    readonly database: Database,
    readonly server: Server,
    readonly message: Message,
}