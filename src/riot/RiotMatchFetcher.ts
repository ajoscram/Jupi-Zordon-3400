import { BotError, ErrorCode } from "../core/concretions";
import { MatchFetcher, Source } from "../core/interfaces";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch, Champion, Participant, TeamStats, PerformanceStats, Role, Team } from "../core/model";
import { ChampionFetcher } from "./champions";
import { Header, HttpClient } from "./http";
import { RawBan, RawCompletedMatch, RawCompletedMatchParticipant, RawLane, RawOngoingMatch, RawOngoingMatchParticipant, RawRole, RawTeam, RawTimeline, TeamId } from "./model";
import { Url } from "./Url";
import { RiotBaseFetcher } from "./RiotBaseFetcher";
import { OngoingMatchSource } from "./OngoingMatchSource";
import { Validate } from "./Validate";

export class RiotMatchFetcher extends RiotBaseFetcher implements MatchFetcher {
    
    private static readonly WIN_STRING: string = "Win";
    
    constructor(
        private readonly client: HttpClient,
        private readonly championFetcher: ChampionFetcher
    ){ super(); }
    
    public async getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch> {
        const requestUrl: string = Url.ONGOING_MATCH.toString() + encodeURIComponent(summoner.id);
        const header: Header = this.createRiotTokenHeader();
        const match: RawOngoingMatch = await this.client.get(requestUrl, [ header ], Validate.rawOngoingMatch);
        return {
            id: match.gameId.toString(),
            date: new Date(match.gameStartTime),
            serverIdentity,
            blue: await this.getTeam(match, TeamId.BLUE),
            red: await this.getTeam(match, TeamId.RED)
        };
    }

    public async getCompletedMatches(ongoingMatches: OngoingMatch[], source?: Source): Promise<CompletedMatch[]>{
        source = source ?? new OngoingMatchSource(ongoingMatches);
        const rawCompletedMatches: RawCompletedMatch[] = await this.getRawCompletedMatches(source);
        const completedMatchPromises: Promise<CompletedMatch>[] = ongoingMatches
            .map(x => this.getCompletedMatch(x, rawCompletedMatches));
        return Promise.all(completedMatchPromises);
    }

    private async getRawCompletedMatches(source: Source): Promise<RawCompletedMatch[]>{
        const header: Header = this.createRiotTokenHeader();
        const promises: Promise<RawCompletedMatch>[] = source.getUrls()
            .map(url => this.client.get(url, [ header ], Validate.rawCompletedMatch));
        return Promise.all(promises);
    }

    private async getTeam(ongoingMatch: RawOngoingMatch, teamId: TeamId): Promise<Team>{
        const teamBans: RawBan[] = ongoingMatch.bannedChampions.filter(x => x.teamId == teamId);
        return {
            bans: await this.getBans(teamBans),
            participants: await this.getTeamParticipants(ongoingMatch.participants, teamId),
        };
    }

    private async getTeamParticipants(rawParticipants: RawOngoingMatchParticipant[], teamId: TeamId): Promise<Participant[]> {
        const teamRawParticipants: RawOngoingMatchParticipant[] = rawParticipants
            .filter(x => x.teamId == teamId);
        const participantPromises: Promise<Participant>[] = teamRawParticipants
            .map(x => this.getParticipant(x));
        return Promise.all(participantPromises);
    }

    private async getParticipant(rawParticipant: RawOngoingMatchParticipant): Promise<Participant>{
        const champion: Champion = await this.championFetcher.getChampion(rawParticipant.championId);
        const summoner: Summoner = { id: rawParticipant.summonerId, name: rawParticipant.summonerName };
        return { summoner, champion };
    }

    private async getCompletedMatch(ongoingMatch: OngoingMatch, rawCompletedMatches: RawCompletedMatch[]): Promise<CompletedMatch> {
        const rawCompletedMatch: RawCompletedMatch = this.findRawCompletedMatch(ongoingMatch, rawCompletedMatches);
        const minutesPlayed: number = Math.round(rawCompletedMatch.gameDuration / 60);
        return {
            id: rawCompletedMatch.gameId.toString(),
            serverIdentity: ongoingMatch.serverIdentity,
            date: new Date(rawCompletedMatch.gameCreation),
            minutesPlayed,
            blue: await this.getTeamStats(TeamId.BLUE, rawCompletedMatch, ongoingMatch),
            red: await this.getTeamStats(TeamId.RED, rawCompletedMatch, ongoingMatch),
        };
    }

    private findRawCompletedMatch(ongoingMatch: OngoingMatch, rawCompletedMatches: RawCompletedMatch[]): RawCompletedMatch{
        const rawCompletedMatch: RawCompletedMatch | undefined = rawCompletedMatches
            .find(x => x.gameId.toString() == ongoingMatch.id);
        if(!rawCompletedMatch)
            throw new BotError(ErrorCode.UNABLE_TO_MATCH_ONGOING_TO_COMPLETED_MATCH);
        else
            return rawCompletedMatch;
    }

    private async getTeamStats(teamId: TeamId, completedMatch: RawCompletedMatch, ongoingMatch: OngoingMatch): Promise<TeamStats> {
        const rawTeam: RawTeam = this.findRawTeam(teamId, completedMatch.teams);
        const rawCompletedMatchParticipants: RawCompletedMatchParticipant[] = completedMatch.participants
            .filter(x => x.teamId == teamId);
        const bans: Champion[] = TeamId.BLUE ? ongoingMatch.blue.bans : ongoingMatch.red.bans;
        const participants: Participant[] = teamId == TeamId.BLUE ?
            ongoingMatch.blue.participants : ongoingMatch.red.participants;
        return {
            won: rawTeam.win == RiotMatchFetcher.WIN_STRING,
            dragons: rawTeam.dragonKills,
            heralds: rawTeam.riftHeraldKills,
            barons: rawTeam.baronKills,
            towers: rawTeam.towerKills,
            bans,
            performanceStats: this.getPerformanceStats(rawCompletedMatchParticipants, participants)
        };
    }

    private findRawTeam(teamId: TeamId, teams: RawTeam[]): RawTeam {
        const rawTeam: RawTeam | undefined = teams.find(x => x.teamId == teamId);
        if(rawTeam)
            return rawTeam;
        else {
            const innerError: Error = new Error(`Could not find the ${TeamId[teamId]} (ID = ${teamId}) team in the RawCompletedMatchData.`);
            throw new BotError(ErrorCode.MISSING_MATCH_DATA, innerError);
        }
    }

    private async getBans(rawBans: RawBan[]): Promise<Champion[]> {
        const banPromises: Promise<Champion>[] =
            rawBans.map(x => this.championFetcher.getChampion(x.championId));
        return Promise.all(banPromises);
    }

    private getPerformanceStats(rawParticipants: RawCompletedMatchParticipant[], participants: Participant[]): PerformanceStats[] {
        const performances: PerformanceStats[] = [];
        for(const rawParticipant of rawParticipants){
            const participant: Participant = this.findParticipant(rawParticipant, participants);
            const performance: PerformanceStats = {
                summoner: participant.summoner,
                champion: participant.champion,
                largestMultikill: rawParticipant.stats.largestMultiKill,
                largestKillingSpree: rawParticipant.stats.largestKillingSpree,
                firstBlood: rawParticipant.stats.firstBloodKill,
                firstTower: rawParticipant.stats.firstTowerKill,
                role: this.getRole(rawParticipant.stats.timeline),
                assists: rawParticipant.stats.assists,
                deaths: rawParticipant.stats.deaths,
                damageDealtToChampions: rawParticipant.stats.totalDamageDealtToChampions,
                damageDealtToObjectives: rawParticipant.stats.damageDealtToObjectives,
                damageReceived: rawParticipant.stats.totalDamageTaken,
                gold: rawParticipant.stats.goldEarned,
                kills: rawParticipant.stats.kills,
                minions: rawParticipant.stats.totalMinionsKilled + rawParticipant.stats.neutralMinionsKilled,
                visionScore: rawParticipant.stats.visionScore,
                crowdControlScore: rawParticipant.stats.timeCCingOthers,
                pentakills: rawParticipant.stats.pentaKills
            };
            performances.push(performance);
        }
        return performances;
    }

    private findParticipant(rawParticipant: RawCompletedMatchParticipant, ongoingMatchParticipants: Participant[]): Participant{
        const championId: string = rawParticipant.championId.toString();
        const participant: Participant | undefined = ongoingMatchParticipants.find(x => x.champion.id === championId);
        if(participant)
            return participant;
        else{
            const innerError: Error = new Error(`Could not find a participant which used a champion with ID ${championId} in the RawCompletedMatchData.`);
            throw new BotError(ErrorCode.MISSING_MATCH_DATA, innerError);
        }
    }

    private getRole(timeline: RawTimeline): Role{
        if(timeline.role == RawRole.SOLO && timeline.lane == RawLane.MIDDLE)
            return Role.MIDDLE;
        else if(timeline.role == RawRole.SOLO && timeline.lane == RawLane.TOP)
            return Role.TOP;
        else if(timeline.role == RawRole.DUO_CARRY && timeline.lane == RawLane.BOTTOM)
            return Role.CARRY;
        else if(timeline.role == RawRole.DUO_SUPPORT && timeline.lane == RawLane.BOTTOM)
            return Role.CARRY;
        else if(timeline.role == RawRole.JUNGLE)
            return Role.JUNGLE;
        else
            return Role.UNKNOWN;
    }
}