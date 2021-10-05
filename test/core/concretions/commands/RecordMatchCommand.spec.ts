import "jasmine";
import { Times } from "typemoq";
import { RecordMatchCommand } from "../../../../src/core/concretions/commands";
import { CompletedMatch, OngoingMatch, Prediction, ServerIdentity, Summoner } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('RecordMatchCommand', () => {
    const contextMock: ContextMock = new ContextMock();
    const dummyFactory: DummyModelFactory = new DummyModelFactory();

    it('execute(): records and replies the ongoing and completed versions of a match', async () => {
        const summonerName: string = "summoner name";
        const summoner: Summoner = dummyFactory.createSummoner();
        const serverIdentity: ServerIdentity = dummyFactory.createServerIndentity();
        const ongoingMatch: OngoingMatch = dummyFactory.createOngoingMatch();
        const prediction: Prediction = dummyFactory.createPrediction();
        const completedMatch: CompletedMatch = dummyFactory.createCompletedMatch();
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => summoner);
        contextMock.serverMock
            .setup(x => x.getIdentity())
            .returns(() => serverIdentity);
        contextMock.matchFetcherMock
            .setup(x => x.getOngoingMatch(summoner, serverIdentity))
            .returns(async () => ongoingMatch);
        contextMock.predictorMock
            .setup(x => x.predict(ongoingMatch))
            .returns(async () => prediction);
        contextMock.matchFetcherMock
            .setup(x => x.getCompletedMatch(ongoingMatch))
            .returns(async () => completedMatch);
        
        const command: RecordMatchCommand = new RecordMatchCommand([ summonerName ]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.insertOngoingMatch(ongoingMatch), Times.once());
        contextMock.messageMock.verify(x => x.replyWithPrediction(prediction), Times.once());
        contextMock.databaseMock.verify(x => x.insertCompletedMatch(completedMatch), Times.once());
        contextMock.messageMock.verify(x => x.replyWithCompletedMatch(completedMatch), Times.once());
    });
});