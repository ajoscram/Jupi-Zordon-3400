import "jasmine";
import { Times } from "typemoq";
import { HelpCommand } from "../../../../src/core/concretions/commands";
import { ContextMock } from "../../../utils";

describe('HelpCommand', () => {
    const contextMock: ContextMock = new ContextMock();

    it('execute(): should reply with help', async () => {
        const command: HelpCommand = new HelpCommand();
        await command.execute(contextMock.object);

        contextMock.messageMock.verify(x => x.replyWithHelp(), Times.once());
    });
});