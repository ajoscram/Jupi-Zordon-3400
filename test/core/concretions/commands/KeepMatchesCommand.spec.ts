import "jasmine";
import { Times } from "typemoq";
import { KeepMatchesCommand } from "../../../../src/core/concretions/commands";
import { CompletedMatch, OngoingMatch, ServerIdentity } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('KeepMatchesCommand', () => {
    let contextMock: ContextMock;
    const dummyFactory: DummyModelFactory = new DummyModelFactory();
    const serverIdentity: ServerIdentity = dummyFactory.createServerIndentity();

    function setupOngoingMatchesToCompletedAndGetList(ongoingMatches: OngoingMatch[]): CompletedMatch[]{
        const completedMatches: CompletedMatch[] = [];
        for(const ongoingMatch of ongoingMatches){
            const completedMatch: CompletedMatch = dummyFactory.createCompletedMatch();
            contextMock.matchFetcherMock
                .setup(x => x.getCompletedMatch(ongoingMatch))
                .returns(async () => completedMatch);
            completedMatches.push(completedMatch);
        }
        return completedMatches;
    }

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
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => ongoingMatches);
        const completedMatches: CompletedMatch[] = setupOngoingMatchesToCompletedAndGetList(ongoingMatches);

        const command: KeepMatchesCommand = new KeepMatchesCommand([]);
        await command.execute(contextMock.object);

        for(const completedMatch of completedMatches)
            contextMock.databaseMock.verify(x => x.insertCompletedMatch(completedMatch), Times.once());
        contextMock.messageMock.verify(x => x.replyWithKeptMatches(completedMatches), Times.once());
    });

    it('execute(): replies to the message appropriately when given a matchIndex', async () => {
        const ongoingMatch: OngoingMatch = dummyFactory.createOngoingMatch();
        const completedMatch: CompletedMatch = dummyFactory.createCompletedMatch();
        const index: number = 1;
        contextMock.databaseMock
            .setup(x => x.getOngoingMatch(serverIdentity, index))
            .returns(async () => ongoingMatch);
        contextMock.matchFetcherMock
            .setup(x => x.getCompletedMatch(ongoingMatch))
            .returns(async () => completedMatch);
        
        const command: KeepMatchesCommand = new KeepMatchesCommand([ index + "" ]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.insertCompletedMatch(completedMatch), Times.once());
        contextMock.messageMock.verify(x => x.replyWithKeptMatches([ completedMatch ]), Times.once());
    });
});