import "jasmine";
import { It, Times } from "typemoq";
import { Source } from "../../../../src/core/interfaces";
import { AttachmentSource } from "../../../../src/core/concretions";
import { KeepMatchesCommand } from "../../../../src/core/concretions/commands";
import { Attachment, CompletedMatch, OngoingMatch, ServerIdentity } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('KeepMatchesCommand', () => {
    let contextMock: ContextMock;
    const dummyFactory: DummyModelFactory = new DummyModelFactory();
    const serverIdentity: ServerIdentity = dummyFactory.createServerIndentity();
    const ongoingMatches: OngoingMatch[] = [ dummyFactory.createOngoingMatch() ];
    const completedMatches: CompletedMatch[] = [ dummyFactory.createCompletedMatch() ];

    beforeEach(() => {
        contextMock = new ContextMock();
        contextMock.serverMock
            .setup(x => x.getIdentity())
            .returns(() => serverIdentity);
        contextMock.messageMock
            .setup(x => x.getAttachments())
            .returns(() => []);
    });

    it('execute(): replies to the message appropriately when not given a matchIndex', async () => {    
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => ongoingMatches);
        contextMock.matchFetcherMock
            .setup(x => x.getCompletedMatches(ongoingMatches, undefined))
            .returns(async () => completedMatches);

        const command: KeepMatchesCommand = new KeepMatchesCommand([]);
        await command.execute(contextMock.object);

        verifyCommandResults(ongoingMatches, completedMatches);
    });

    it('execute(): replies to the message appropriately when given a matchIndex', async () => {
        const index: number = 0;
        contextMock.databaseMock
            .setup(x => x.getOngoingMatch(serverIdentity, index))
            .returns(async () => ongoingMatches[0]);
        contextMock.matchFetcherMock
            .setup(x => x.getCompletedMatches(ongoingMatches, undefined))
            .returns(async () => completedMatches);
        
        const command: KeepMatchesCommand = new KeepMatchesCommand([ index.toString() ]);
        await command.execute(contextMock.object);

        verifyCommandResults(ongoingMatches, completedMatches);
    });

    it('execute(): replies to the message appropriately when given attachments', async () => {
        const attachments: Attachment[] = [ dummyFactory.createAttachment() ];
        let source: Source | null = null;
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => ongoingMatches);
        contextMock.messageMock.reset();
        contextMock.messageMock
            .setup(x => x.getAttachments())
            .returns(() => attachments);
        contextMock.matchFetcherMock
            .setup(x => x.getCompletedMatches(ongoingMatches, It.isAny()))
            .callback((_, s: Source) => source = s)
            .returns(async () => completedMatches);

        const command: KeepMatchesCommand = new KeepMatchesCommand([ ]);
        await command.execute(contextMock.object);

        expect(source).toBeInstanceOf(AttachmentSource);
        verifyCommandResults(ongoingMatches, completedMatches);
    });

    function verifyCommandResults(ongoingMatches: OngoingMatch[], completedMatches: CompletedMatch[]): void{
        contextMock.databaseMock.verify(x => x.insertCompletedMatches(completedMatches), Times.once());
        contextMock.databaseMock.verify(x => x.deleteOngoingMatches(ongoingMatches), Times.once());
        contextMock.messageMock.verify(x => x.replyWithKeptMatches(completedMatches), Times.once());
    }
});