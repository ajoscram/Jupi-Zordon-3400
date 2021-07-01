import { Context } from '../concretions';

export abstract class Command{
    constructor(
        protected readonly options: string[]
    ){ }

    public abstract execute(context: Context): Promise<void>;
}