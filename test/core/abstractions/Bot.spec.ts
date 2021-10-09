import { IMock, Mock, Times } from "typemoq";
import "jasmine";
import { Bot, Command, CommandFactory } from "../../../src/core/abstractions";
import { ContextMock, TestableBot } from "../../utils";
import { BotError, ErrorCode } from "../../../src/core/concretions";

describe('Bot', () => {
    let contextMock: ContextMock;
    let commandFactoryMock: IMock<CommandFactory>;
    let commandMock: IMock<Command>;
    let bot: Bot;

    beforeEach(async () => {
        contextMock = new ContextMock();
        commandFactoryMock = Mock.ofType<CommandFactory>();
        commandMock = Mock.ofType<Command>();
        bot = new TestableBot(commandFactoryMock.object, contextMock.object);
        
        commandFactoryMock
            .setup(x => x.tryCreateCommand(contextMock.object.message))
            .returns(() => commandMock.object);
    });

    it('process(): should execute commands', async () => {
        await bot.run();

        commandMock.verify(x => x.execute(contextMock.object), Times.once());
    });

    it('process(): should reply message with ErrorCode.UNKNOWN when a non error is thrown', async () => {
        commandMock.setup(x => x.execute(contextMock.object)).returns(() => { throw "non error" });
        
        await bot.run();

        contextMock.messageMock.verify(x => x.replyWithError(ErrorCode.UNKNOWN), Times.once());
    });

    it('process(): should reply message with ErrorCode.UNKNOWN when an error that is not a BotError is thrown', async () => {
        commandMock.setup(x => x.execute(contextMock.object)).throws(new Error());
        
        await bot.run();

        contextMock.messageMock.verify(x => x.replyWithError(ErrorCode.UNKNOWN), Times.once());
    });

    it('process(): should reply message with the correct ErrorCode error when a BotError is thrown', async () => {
        //error code chosen arbitrarily
        const error: BotError = new BotError(ErrorCode.ACCOUNT_NOT_FOUND);
        commandMock.setup(x => x.execute(contextMock.object)).throws(error);
        
        await bot.run();

        contextMock.messageMock.verify(x => x.replyWithError(ErrorCode.ACCOUNT_NOT_FOUND), Times.once());
    });
});