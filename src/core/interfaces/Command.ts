import { Context } from '../concretions';

export interface Command{
    execute(context: Context): Promise<void>;
}