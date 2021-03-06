import "jasmine";
import { IMock, It, Mock, Times } from "typemoq";
import { RiotMatchFetcher } from "../../src/riot";
import { ChampionFetcher } from "../../src/riot/champions";
import { DummyModelFactory } from "../utils";
import { HttpClient } from "../../src/riot/http";
import { RawBan, RawCompletedMatch, RawCompletedMatchParticipant, RawOngoingMatch, RawOngoingMatchParticipant, RawTeam, TeamId } from "../../src/riot/model";
import { CompletedMatch, OngoingMatch, Participant, PerformanceStats, ServerIdentity, Summoner, Team, TeamStats } from "../../src/core/model";
import { BotError, ErrorCode } from "../../src/core/concretions";
import { Url } from "../../src/riot/Url";
import { Source } from "../../src/core/interfaces";

describe('RiotMatchFetcher', () => {
    const modelFactory: DummyModelFactory = new DummyModelFactory();
    const serverIdentity: ServerIdentity = modelFactory.createServerIndentity();
    const summoner: Summoner = modelFactory.createSummoner();

    let clientMock: IMock<HttpClient>;
    let championFetcherMock: IMock<ChampionFetcher>;
    let fetcher: RiotMatchFetcher;

    beforeEach(async () => {
        clientMock = Mock.ofType<HttpClient>();
        championFetcherMock = Mock.ofType<ChampionFetcher>();
        fetcher = new RiotMatchFetcher(clientMock.object, championFetcherMock.object);

        championFetcherMock
            .setup(x => x.getChampion(It.isAnyNumber()))
            .returns(async (id: number) => modelFactory.createChampion(id));
    });

    it('getOngoingMatch(): should return correctly if a custom match is queried', async () => {
        const rawMatch: RawOngoingMatch = modelFactory.createRawOngoingMatch("CUSTOM_GAME");
        const ongoingMatchUrl: string = Url.ONGOING_MATCH + encodeURIComponent(summoner.id);
        clientMock
            .setup(x => x.get(ongoingMatchUrl, It.isAny(), It.isAny()))
            .returns(async () => rawMatch);
        
        const match: OngoingMatch = await fetcher.getOngoingMatch(summoner, serverIdentity);
        
        expect(match.id).toBe(rawMatch.gameId.toString());
        expect(match.serverIdentity).toBe(serverIdentity);
        expect(match.date).toEqual(new Date(rawMatch.gameStartTime));
        validateTeam(match.blue, rawMatch, TeamId.BLUE);
        validateTeam(match.red, rawMatch, TeamId.RED);
    });

    it('getCompletedMatches(): should return correctly when given custom matches with all the expected data in it', async () => {
        const ongoingMatch: OngoingMatch = modelFactory.createOngoingMatch();
        const rawCompletedMatch: RawCompletedMatch = modelFactory.createRawCompletedMatch(ongoingMatch);
        clientMock
            .setup(x => x.get(It.isAny(), It.isAny(), It.isAny()))
            .returns(async () => rawCompletedMatch);
        
        const completedMatches: CompletedMatch[] = await fetcher.getCompletedMatches([ ongoingMatch ]);

        validateCompletedMatch(completedMatches[0], rawCompletedMatch, ongoingMatch);
    });

    it('getCompletedMatch(): should use the source URLs if a source is passed in', async () => {
        const ongoingMatch: OngoingMatch = modelFactory.createOngoingMatch();
        const rawCompletedMatch: RawCompletedMatch = modelFactory.createRawCompletedMatch(ongoingMatch);
        const url: string = "url";
        const sourceMock: IMock<Source> = Mock.ofType();
        sourceMock
            .setup(x => x.getUrls())
            .returns(() => [ url ]);
        clientMock
            .setup(x => x.get(url, It.isAny(), It.isAny()))
            .returns(async () => rawCompletedMatch);
        
        const completedMatches: CompletedMatch[] =
            await fetcher.getCompletedMatches([ ongoingMatch ], sourceMock.object);

        validateCompletedMatch(completedMatches[0], rawCompletedMatch, ongoingMatch);
    });

    it('getCompletedMatches(): should fail with MISSING_MATCH_DATA when missing information for a team', async () => {
        const ongoingMatch: OngoingMatch = modelFactory.createOngoingMatch();
        const rawCompletedMatch: RawCompletedMatch = modelFactory.createRawCompletedMatch(ongoingMatch, false);
        clientMock
            .setup(x => x.get(It.isAny(), It.isAny(), It.isAny()))
            .returns(async () => rawCompletedMatch);
        
        await expectAsync(fetcher.getCompletedMatches([ ongoingMatch ])).toBeRejectedWith(
            new BotError(ErrorCode.MISSING_MATCH_DATA)
        );
    });

    it('getCompletedMatch(): should fail with MISSING_MATCH_DATA when paricipant identities fail to be linked', async () => {
        const ongoingMatch: OngoingMatch = modelFactory.createOngoingMatch();
        const rawCompletedMatch: RawCompletedMatch = modelFactory.createRawCompletedMatch(ongoingMatch, true, false);
        clientMock
            .setup(x => x.get(It.isAny(), It.isAny(), It.isAny()))
            .returns(async () => rawCompletedMatch);
        
        await expectAsync(fetcher.getCompletedMatches([ ongoingMatch ])).toBeRejectedWith(
            new BotError(ErrorCode.MISSING_MATCH_DATA)
        );
    });

    it('getCompletedMatch(): should fail with UNABLE_TO_MATCH_ONGOING_TO_COMPLETED_MATCH if no completed match is found for a corresponding ongoing match', async () => {
        const ongoingMatch: OngoingMatch = modelFactory.createOngoingMatch();
        const rawCompletedMatch: RawCompletedMatch = modelFactory.createRawCompletedMatch();
        clientMock
            .setup(x => x.get(It.isAny(), It.isAny(), It.isAny()))
            .returns(async () => rawCompletedMatch);
        
        await expectAsync(fetcher.getCompletedMatches([ ongoingMatch ])).toBeRejectedWith(
            new BotError(ErrorCode.UNABLE_TO_MATCH_ONGOING_TO_COMPLETED_MATCH)
        );
    });

    function validateTeam(team: Team, match: RawOngoingMatch, teamId: TeamId): void {
        const rawTeamParticipants: RawOngoingMatchParticipant[] = match.participants.filter(x => x.teamId == teamId);
        const rawTeamBans: RawBan[] = match.bannedChampions.filter(x => x.teamId == teamId);
        validateParticipants(team.participants, rawTeamParticipants);
        validateBans(rawTeamBans);
    }

    function validateParticipants(participants: Participant[], rawParticipants: RawOngoingMatchParticipant[]): void {
        for(const participant of participants){
            const rawParticipant: RawOngoingMatchParticipant | undefined = rawParticipants.find(raw =>
                raw.summonerName == participant.summoner.name &&
                raw.summonerId == participant.summoner.id
            );
            expect(rawParticipant).toBeDefined();
        }
    }

    function validateBans(rawBans: RawBan[]): void{
        for(const ban of rawBans){
            championFetcherMock.verify(
                x => x.getChampion(ban.championId),
                Times.once()
            );
        }
    }

    function validateCompletedMatch(completedMatch: CompletedMatch, rawCompletedMatch: RawCompletedMatch, ongoingMatch: OngoingMatch): void{
        expect(completedMatch.id).toBe(rawCompletedMatch.gameId.toString());
        expect(completedMatch.serverIdentity).toEqual(ongoingMatch.serverIdentity);
        expect(completedMatch.date).toEqual(new Date(rawCompletedMatch.gameCreation));
        expect(completedMatch.minutesPlayed).toBe(Math.round(rawCompletedMatch.gameDuration / 60));
        validateTeamStats(TeamId.BLUE, completedMatch.blue, rawCompletedMatch, ongoingMatch.blue);
        validateTeamStats(TeamId.RED, completedMatch.red, rawCompletedMatch, ongoingMatch.red);
    }

    function validateTeamStats(teamId: TeamId, teamStats: TeamStats, rawCompletedMatch: RawCompletedMatch, team: Team): void{
        const rawTeam: RawTeam | undefined = rawCompletedMatch.teams.find(x => x.teamId == teamId);
        const rawTeamParticipants: RawCompletedMatchParticipant[] = rawCompletedMatch.participants.filter(x => x.teamId == teamId);
        if(rawTeam){
            expect(teamStats.won).toBe(rawTeam.win == "Win");
            expect(teamStats.dragons).toBe(rawTeam.dragonKills);
            expect(teamStats.heralds).toBe(rawTeam.riftHeraldKills);
            expect(teamStats.barons).toBe(rawTeam.baronKills);
            expect(teamStats.towers).toBe(rawTeam.towerKills);
            validatePerformanceStats(teamStats.performanceStats, rawTeamParticipants, team.participants);
        }
        else
            fail("failed to find the " + TeamId[teamId] + " team");
    }

    function validatePerformanceStats(performances: PerformanceStats[], rawCompletedMatchParticipants: RawCompletedMatchParticipant[], ongoingMatchParticipants: Participant[]): void{
        for(const rawParticipant of rawCompletedMatchParticipants){
            const ongoingMatchParticipant: Participant | undefined = ongoingMatchParticipants.find(x =>
                x.champion.id == rawParticipant.championId.toString()
            );
            const performance: PerformanceStats | undefined = performances.find(x =>
                x.summoner.id == ongoingMatchParticipant?.summoner.id &&
                x.champion.id == ongoingMatchParticipant?.champion.id
            );
            if(performance){
                expect(performance.largestMultikill).toBe(rawParticipant.stats.largestMultiKill);
                expect(performance.largestKillingSpree).toBe(rawParticipant.stats.largestKillingSpree);
                expect(performance.firstBlood).toBe(rawParticipant.stats.firstBloodKill);
                expect(performance.firstTower).toBe(rawParticipant.stats.firstTowerKill);
                expect(performance.assists).toBe(rawParticipant.stats.assists);
                expect(performance.deaths).toBe(rawParticipant.stats.deaths);
                expect(performance.damageDealtToChampions).toBe(rawParticipant.stats.totalDamageDealtToChampions);
                expect(performance.damageReceived).toBe(rawParticipant.stats.totalDamageTaken);
                expect(performance.gold).toBe(rawParticipant.stats.goldEarned);
                expect(performance.kills).toBe(rawParticipant.stats.kills);
                expect(performance.minions).toBe(rawParticipant.stats.totalMinionsKilled + rawParticipant.stats.neutralMinionsKilled);
                expect(performance.visionScore).toBe(rawParticipant.stats.visionScore);
                expect(performance.crowdControlScore).toBe(rawParticipant.stats.timeCCingOthers);
                expect(performance.pentakills).toBe(rawParticipant.stats.pentaKills);
            }
            else
                fail("couldn't find a PerformanceStats with the same summoner and champion id in the match");
        }
    }
});