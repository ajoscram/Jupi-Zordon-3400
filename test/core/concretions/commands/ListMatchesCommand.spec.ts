import "jasmine";
import { Times } from "typemoq";
import { ListMatchesCommand } from "../../../../src/core/concretions/commands";
import { OngoingMatch, ServerIdentity } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('ListMatchesCommand', () => {
    const contextMock: ContextMock = new ContextMock();
    const dummyFactory: DummyModelFactory = new DummyModelFactory();

    it('execute(): should send the list of recorded ongoing matches for the server where it was invoked', async () => {
        const serverIdentity: ServerIdentity = dummyFactory.createServerIndentity();
        const matches: OngoingMatch[] = [ dummyFactory.createOngoingMatch() ];
        contextMock.serverMock
            .setup(x => x.getIdentity())
            .returns(() => serverIdentity);
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => matches);
        
        const command: ListMatchesCommand = new ListMatchesCommand();
        await command.execute(contextMock.object);

        contextMock.serverMock.verify(x => x.getIdentity(), Times.once());
        contextMock.databaseMock.verify(x => x.getOngoingMatches(serverIdentity), Times.once());
    });
});