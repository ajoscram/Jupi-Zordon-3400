import "jasmine";
import { IMock, It, Mock } from "typemoq";
import { ChampionFetcher, DataDragonChampionFetcher } from "../../../src/riot/champions";
import { HttpClient } from "../../../src/riot/http";
import { RawChampion, RawChampionContainer } from "../../../src/riot/model";
import { DummyModelFactory } from "../../utils";
import { Champion } from "../../../src/core/model";
import { BotError, ErrorCode } from "../../../src/core/concretions";
import { Url } from "../../../src/riot/utils";

describe('DataDragonChampionFetcher', () => {

    const versions: string[] = [ "1", "0" ];
    const championsUrl: string = Url.CHAMPIONS.replace("[VERSION]", versions[0]);
    const container: RawChampionContainer = new DummyModelFactory().createRawChampionContainer();

    let clientMock: IMock<HttpClient>;
    let fetcher: ChampionFetcher;

    beforeEach(async () => {
        clientMock = Mock.ofType<HttpClient>();
        fetcher = new DataDragonChampionFetcher(clientMock.object);

        clientMock
            .setup(x => x.get(Url.VERSION, It.isAny()))
            .returns(async () => versions);
        
        clientMock
            .setup(x => x.get(championsUrl, It.isAny()))
            .returns(async () => container);
    });

    it('getChampion(): should return every champion available in the container', async () => {
        for(const championContainerId in container.data){
            const rawChampion: RawChampion = container.data[championContainerId];
            const champion: Champion = await fetcher.getChampion(Number.parseInt(rawChampion.key));
            expect(champion).toBeTruthy();
        }
    });

    it('getChampion(): should throw a BotError if given a non-existent champion ID', async () => {
        const incorrectId: number = -1;
        const innerError: Error = new Error(`Champion lookup failed for ID: ${incorrectId}`);
        const error: BotError = new BotError(ErrorCode.UNKNOWN_CHAMPION_ID, innerError);
        await expectAsync(fetcher.getChampion(incorrectId)).toBeRejectedWith(error);
    });
});