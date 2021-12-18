import "jasmine";
import { Times } from "typemoq";
import { DiscardMatchesCommand } from "../../../../src/core/concretions/commands";
import { OngoingMatch, ServerIdentity } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('DiscardMatchesCommand', () => {
    let contextMock: ContextMock;
    const dummyFactory: DummyModelFactory = new DummyModelFactory();
    const serverIdentity: ServerIdentity = dummyFactory.createServerIndentity();

    beforeEach(() => {
        contextMock = new ContextMock();
        contextMock.serverMock
            .setup(x => x.getIdentity())
            .returns(() => serverIdentity);
    });

    it('execute(): replies to the message appropriately when not given a matchIndex', async () => {
        const matches: OngoingMatch[] = [
            dummyFactory.createOngoingMatch(),
            dummyFactory.createOngoingMatch(),
            dummyFactory.createOngoingMatch(),
        ];
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => matches);
        
        const command: DiscardMatchesCommand = new DiscardMatchesCommand([]);
        await command.execute(contextMock.object);

        for(const match of matches)
            contextMock.databaseMock.verify(x => x.deleteOngoingMatch(match), Times.once());
        contextMock.messageMock.verify(x => x.replyWithDiscardedMatches(matches), Times.once());
    });

    it('execute(): replies to the message appropriately when given a matchIndex', async () => {
        const match: OngoingMatch = dummyFactory.createOngoingMatch();
        const index: number = 1;
        contextMock.databaseMock
            .setup(x => x.getOngoingMatch(serverIdentity, index))
            .returns(async () => match);
        
        const command: DiscardMatchesCommand = new DiscardMatchesCommand([ index + "" ]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.deleteOngoingMatch(match), Times.once());
        contextMock.messageMock.verify(x => x.replyWithDiscardedMatches([ match ]), Times.once());
    });
});