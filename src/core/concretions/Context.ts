import { Predictor, Database, Message, Server, MatchFetcher, SummonerFetcher } from '../abstractions';

export class Context{
    constructor(
        public readonly summonerFetcher: SummonerFetcher,
        public readonly matchFetcher: MatchFetcher,
        public readonly predictor: Predictor,
        public readonly database: Database,
        public readonly server: Server,
        public readonly message: Message,
    ){}
}