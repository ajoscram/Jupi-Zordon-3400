import "jasmine";
import { IMock, It, Mock } from "typemoq";
import { MatchFetcher } from "../../src/core/abstractions";
import { RiotMatchFetcher } from "../../src/riot";
import { ChampionFetcher } from "../../src/riot/champions";
import { DummyModelFactory } from "../utils";
import { HttpClient } from "../../src/riot/http";
import { RawOngoingMatch, RawOngoingMatchParticipant, TeamId } from "../../src/riot/model";
import { OngoingMatch, Participant, ServerIdentity, Summoner } from "../../src/core/model";

describe('RiotMatchFetcher', () => {
    const modelFactory: DummyModelFactory = new DummyModelFactory();
    const serverIdentity: ServerIdentity = modelFactory.createServerIndentity();
    const summoner: Summoner = modelFactory.createSummoner();
    const ongoingMatchUrl: string = RiotMatchFetcher.ONGOING_MATCH_URL + encodeURIComponent(summoner.id);

    let clientMock: IMock<HttpClient>;
    let championFetcherMock: IMock<ChampionFetcher>;
    let fetcher: MatchFetcher;

    beforeEach(async () => {
        clientMock = Mock.ofType<HttpClient>();
        championFetcherMock = Mock.ofType<ChampionFetcher>();
        fetcher = new RiotMatchFetcher(clientMock.object, championFetcherMock.object);

        championFetcherMock
            .setup(x => x.getChampion(It.isAnyNumber()))
            .returns(async () => modelFactory.createChampion());
    });

    it('getOngoingMatch(): should return correctly if a custom match is queried', async () => {
        const rawMatch: RawOngoingMatch = modelFactory.createRawOngoingMatch(RiotMatchFetcher.CUSTOM_GAME_TYPE);
        clientMock
            .setup(x => x.get(ongoingMatchUrl, It.isAny()))
            .returns(async () => rawMatch);
        
        const match: OngoingMatch = await fetcher.getOngoingMatch(summoner, serverIdentity);
        
        expect(match.id).toBe(rawMatch.gameId.toString());
        expect(match.serverIdentity).toBe(serverIdentity);
        for(const participant of match.blue)
            expect(findParticipant(rawMatch.participants, participant, TeamId.BLUE)).toBeDefined();
        for(const participant of match.red)
            expect(findParticipant(rawMatch.participants, participant, TeamId.RED)).toBeDefined();
    });
});

function findParticipant(rawParticipants: RawOngoingMatchParticipant[], participant: Participant, team: TeamId): RawOngoingMatchParticipant | undefined {
    return rawParticipants.find(
        raw => raw.teamId == team &&
            raw.summonerName == participant.summoner.name &&
            raw.summonerId == participant.summoner.id
    );
}