import { IMock } from "typemoq";
import { CommandFactory, Message, Bot } from "../../src/core/abstractions";
import { Context } from "../../src/core/concretions";
import { ContextMockBuilder } from ".";

export class TestableBot extends Bot{
    constructor(
        commandFactoryMock: IMock<CommandFactory>,
        private readonly contextMockBuilder: ContextMockBuilder){
        super(commandFactoryMock.object);
    }

    public async initialize(): Promise<void> { }
    
    public async run(): Promise<void> {
        await this.process(this.contextMockBuilder.message.object);
    }

    protected getContext(message: Message): Context {
        return this.contextMockBuilder.build();
    }
}