import { Message } from '.';
import { Context } from '../concretions';

export abstract class Command{
    constructor(public message: Message){ }

    public abstract execute(context: Context): void;
}