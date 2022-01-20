import "jasmine";
import { Times } from "typemoq";
import { KeepMatchesCommand } from "../../../../src/core/concretions/commands";
import { CompletedMatch, OngoingMatch, ServerIdentity } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('KeepMatchesCommand', () => {
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
        const ongoingMatches: OngoingMatch[] = [
            dummyFactory.createOngoingMatch(),
            dummyFactory.createOngoingMatch(),
            dummyFactory.createOngoingMatch(),
        ];
        const completedMatches: CompletedMatch[] = setupOngoingMatchesToCompletedAndGetList(ongoingMatches);
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => ongoingMatches);        

        const command: KeepMatchesCommand = new KeepMatchesCommand([]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.insertCompletedMatches(completedMatches), Times.once());
        contextMock.messageMock.verify(x => x.replyWithKeptMatches(completedMatches), Times.once());
    });

    it('execute(): replies to the message appropriately when given a matchIndex', async () => {
        const ongoingMatches: OngoingMatch[] = [ dummyFactory.createOngoingMatch() ];
        const completedMatches: CompletedMatch[] = [ dummyFactory.createCompletedMatch() ];
        const index: number = 1;
        contextMock.databaseMock
            .setup(x => x.getOngoingMatch(serverIdentity, index))
            .returns(async () => ongoingMatches[0]);
        contextMock.completedMatchFetcherMock
            .setup(x => x.getCompletedMatches(ongoingMatches))
            .returns(async () => completedMatches);
        
        const command: KeepMatchesCommand = new KeepMatchesCommand([ index + "" ]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.insertCompletedMatches(completedMatches), Times.once());
        contextMock.messageMock.verify(x => x.replyWithKeptMatches(completedMatches), Times.once());
    });

    function setupOngoingMatchesToCompletedAndGetList(ongoingMatches: OngoingMatch[]): CompletedMatch[]{
        const completedMatches: CompletedMatch[] = ongoingMatches.map(_ => dummyFactory.createCompletedMatch());
        contextMock.completedMatchFetcherMock
            .setup(x => x.getCompletedMatches(ongoingMatches))
            .returns(async () => completedMatches);
        return completedMatches;
    }
});