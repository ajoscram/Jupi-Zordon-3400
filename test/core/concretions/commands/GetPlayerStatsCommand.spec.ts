import "jasmine";
import { Times } from "typemoq";
import { Summoner, SummonerOverallStats } from "../../../../src/core/model";
import { GetPlayerStatsCommand } from "../../../../src/core/concretions/commands";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('GetPlayerStatsCommand', () => {
    const dummyFactory: DummyModelFactory = new DummyModelFactory();
    const contextMock: ContextMock = new ContextMock();

    it('execute(): should reply the summoners overall stats', async () => {
        const summonerName: string = "summoner name";
        const summoner: Summoner = dummyFactory.createSummoner();
        const stats: SummonerOverallStats = dummyFactory.createSummonerOverallStats();
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => summoner);
        contextMock.databaseMock
            .setup(x => x.getSummonerOverallStats(summoner))
            .returns(async () => stats);

        const command: GetPlayerStatsCommand = new GetPlayerStatsCommand([summonerName]);
        await command.execute(contextMock.object);
        
        contextMock.messageMock.verify(x => x.replyWithSummonerStats(stats), Times.once());
    });
});