import { IMock, Mock, Times } from "typemoq";
import "jasmine";
import { Bot, CommandFactory } from "../../../src/core/abstractions";
import { ContextMockBuilder, TestableBot } from "../../utils";
import { BotError, ErrorCode } from "../../../src/core/concretions";

describe('Bot', () => {
    let contextMockBuilder: ContextMockBuilder;
    let commandFactoryMock: IMock<CommandFactory>;
    let bot: Bot;

    beforeEach(async () => {
        contextMockBuilder = new ContextMockBuilder();
        commandFactoryMock = Mock.ofType<CommandFactory>();
        bot = new TestableBot(commandFactoryMock, contextMockBuilder);
    });

    it('process(): should reply message with unknown error when an exception occurs', async () => {
        const error: BotError = new BotError(ErrorCode.UNKNOWN);
        commandFactoryMock.setup(x => x.tryCreateCommand).throws(error);
        
        bot.run();

        contextMockBuilder.message.verify(x => x.replyWithError(error.code), Times.once());
    });
});