import { Predictor, Database, Message, Server } from '../abstractions';
import { Fetcher } from '.'

export class Context{
    constructor(
        public readonly fetcher: Fetcher,
        public readonly predictor: Predictor,
        public readonly database: Database,
        public readonly server: Server,
        public readonly message: Message,
    ){}
}