import { Predictor, Database } from '../abstractions';
import { Fetcher } from '.'

export class Context{
    constructor(
        public fetcher: Fetcher,
        public predictor: Predictor,
        public database: Database
    ){}
}