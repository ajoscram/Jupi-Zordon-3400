import { Predictor, Database, Message } from '../abstractions';
import { Fetcher } from '.'

export class Context{
    constructor(
        public readonly fetcher: Fetcher,
        public readonly predictor: Predictor,
        public readonly database: Database,
        public readonly message: Message
    ){}
}