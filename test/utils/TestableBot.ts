import { CommandFactory, Message, Bot } from "../../src/core/abstractions";
import { Context } from "../../src/core/concretions";

export class TestableBot extends Bot{
    constructor(
        commandFactory: CommandFactory,
        private readonly context: Context){
        super(commandFactory);
    }

    public async initialize(): Promise<void> { }
    
    public async run(): Promise<void> {
        await this.process(this.context.message);
    }

    protected getContext(message: Message): Context {
        return this.context;
    }
}