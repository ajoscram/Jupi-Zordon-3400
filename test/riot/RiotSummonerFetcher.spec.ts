import "jasmine";
import { IMock, It, Mock } from "typemoq";
import { HttpClient } from "../../src/http";
import { Summoner } from "../../src/core/model";
import { RawSummoner } from "../../src/riot/model";
import { DummyModelFactory } from "../utils";
import { SummonerFetcher } from "../../src/core/abstractions";
import { RiotSummonerFetcher } from "../../src/riot";
import { Url } from "../../src/riot/Url";

describe('RiotSummonerFetcher', () => {
    let clientMock: IMock<HttpClient>;
    let fetcher: SummonerFetcher;

    beforeEach(async () => {
        clientMock = Mock.ofType<HttpClient>();
        fetcher = new RiotSummonerFetcher(clientMock.object);
    });

    it('getSummoner(): should return a summoner object with the correct information', async () => {
        const rawSummoner: RawSummoner = new DummyModelFactory().createRawSummoner();
        const url: string = Url.SUMMONER + encodeURIComponent(rawSummoner.name);
        clientMock
            .setup(x => x.get(url, It.isAny()))
            .returns(async () => rawSummoner);

        const summoner: Summoner = await fetcher.getSummoner(rawSummoner.name);

        expect(summoner.name).toBe(rawSummoner.name);
        expect(summoner.id).toBe(rawSummoner.id);
    });
});