import "jasmine";
import { Times } from "typemoq";
import { HelpCommand } from "../../../../src/core/concretions/commands";
import { ContextMock } from "../../../utils";

describe('HelpCommand', () => {

    it('execute(): should reply with help', async () => {
        const contextMock: ContextMock = new ContextMock();

        const command: HelpCommand = new HelpCommand();
        await command.execute(contextMock.object);

        contextMock.messageMock.verify(x => x.replyWithHelp(), Times.once());
    });

});