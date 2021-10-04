import "jasmine";
import { Times } from "typemoq";
import { Summoner, SummonerOverallStats } from "../../../../src/core/model";
import { GetPlayerStatsCommand } from "../../../../src/core/concretions/commands";
import { ContextMockBuilder, DummyModelFactory } from "../../../utils";

describe('GetPlayerStatsCommand', () => {
    it('execute(): returns a summoners overall stats', async () => {
        const summonerName: string = "summoner name";
        const dummyFactory: DummyModelFactory = new DummyModelFactory();
        const summoner: Summoner = dummyFactory.createSummoner();
        const stats: SummonerOverallStats = dummyFactory.createSummonerOverallStats();
        const contextMockBuilder: ContextMockBuilder = new ContextMockBuilder();
        contextMockBuilder.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => summoner);
        contextMockBuilder.databaseMock
            .setup(x => x.getSummonerOverallStats(summoner))
            .returns(async () => stats);

        const command: GetPlayerStatsCommand = new GetPlayerStatsCommand([summonerName]);
        await command.execute(contextMockBuilder.context);
        
        contextMockBuilder.messageMock.verify(x => x.replyWithSummonerStats(stats), Times.once());
    });
});