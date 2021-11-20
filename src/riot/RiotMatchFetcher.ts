import { BotError, ErrorCode } from "../core/concretions";
import { MatchFetcher } from "../core/abstractions";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch, Champion, Participant, TeamStats, PerformanceStats, Role } from "../core/model";
import { ChampionFetcher } from "./champions";
import { Header, HttpClient } from "./http";
import { RawBan, RawCompletedMatch, RawCompletedMatchParticipant, RawLane, RawOngoingMatch, RawOngoingMatchParticipant, RawRole, RawTeam, RawTimeline, TeamId } from "./model";
import { createRiotTokenHeader } from "./utils";

export class RiotMatchFetcher implements MatchFetcher {
    
    public static readonly CUSTOM_GAME_TYPE: string = "CUSTOM_GAME";
    public static readonly ONGOING_MATCH_URL: string = "https://la1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/";
    public static readonly COMPLETED_MATCH_URL: string = "https://la1.api.riotgames.com/lol/match/v4/matches/";

    constructor(
        private readonly client: HttpClient,
        private readonly championFetcher: ChampionFetcher
    ){ };
    
    public async getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch> {
        const requestUrl: string = RiotMatchFetcher.ONGOING_MATCH_URL + encodeURIComponent(summoner.id);
        const header: Header = createRiotTokenHeader();
        const match: RawOngoingMatch = await this.client.get(requestUrl, [ header ]) as RawOngoingMatch;
        this.validateRawOngoingMatch(match); //TODO: pull this out of here to the command itself
        return {
            id: match.gameId.toString(),
            serverIdentity,
            blue: await this.getTeamParticipants(match.participants, TeamId.BLUE),
            red: await this.getTeamParticipants(match.participants, TeamId.RED)
        };
    }

    private validateRawOngoingMatch(rawOngoingMatch: RawOngoingMatch): void {
        if(rawOngoingMatch.gameType != RiotMatchFetcher.CUSTOM_GAME_TYPE)
            throw new BotError(ErrorCode.ONGOING_MATCH_IS_NOT_CUSTOM);
    }

    private async getTeamParticipants(rawParticipants: RawOngoingMatchParticipant[], teamId: TeamId): Promise<Participant[]> {
        const participants: Participant[] = [];
        for(const rawParticipant of rawParticipants){
            if(rawParticipant.teamId == teamId){
                const participant: Participant = await this.getParticipant(rawParticipant);
                participants.push(participant);
            }
        }
        return participants;
    }

    private async getParticipant(rawParticipant: RawOngoingMatchParticipant): Promise<Participant>{
        const champion: Champion = await this.championFetcher.getChampion(rawParticipant.championId);
        const summoner: Summoner = { id: rawParticipant.summonerId, name: rawParticipant.summonerName };
        return { summoner, champion };
    }

    public async getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch> {
        const requestUrl: string = RiotMatchFetcher.COMPLETED_MATCH_URL + encodeURIComponent(ongoingMatch.id);
        const header: Header = createRiotTokenHeader();
        const completedMatch: RawCompletedMatch = await this.client.get(requestUrl, [ header ]) as RawCompletedMatch;
        const minutesPlayed: number = Math.round(completedMatch.gameDuration / 60);
        return {
            id: ongoingMatch.id,
            serverIdentity: ongoingMatch.serverIdentity,
            date: new Date(completedMatch.gameCreation),
            minutesPlayed,
            blue: await this.getTeamStats(TeamId.BLUE, completedMatch, ongoingMatch, minutesPlayed),
            red: await this.getTeamStats(TeamId.RED, completedMatch, ongoingMatch, minutesPlayed),
        };
    }

    private async getTeamStats(teamId: TeamId, completedMatch: RawCompletedMatch, ongoingMatch: OngoingMatch, minutesPlayed: number): Promise<TeamStats> {
        const rawTeam: RawTeam = this.getRawTeam(teamId, completedMatch.teams);
        const rawCompletedMatchParticipants: RawCompletedMatchParticipant[] = completedMatch.participants.filter(x => x.teamId == teamId);
        const participants: Participant[] = teamId == TeamId.BLUE ? ongoingMatch.blue : ongoingMatch.red;
        return {
            won: rawTeam.win == "Win",
            dragons: rawTeam.dragonKills,
            heralds: rawTeam.riftHeraldKills,
            barons: rawTeam.baronKills,
            towers: rawTeam.towerKills,
            bans: await this.getBans(rawTeam.bans),
            performanceStats: this.getPerformanceStats(rawCompletedMatchParticipants, participants, minutesPlayed)
        }
    }

    private getRawTeam(teamId: TeamId, teams: RawTeam[]): RawTeam {
        const rawTeam: RawTeam | undefined = teams.find(x => x.teamId == teamId);
        if(rawTeam)
            return rawTeam;
        else{
            const innerError: Error = new Error(`Could not find a team with ID ${teamId} in the RawCompletedMatchData.`);
            throw new BotError(ErrorCode.MISSING_MATCH_DATA, innerError);
        }
    }

    private async getBans(rawBans: RawBan[]): Promise<Champion[]> {
        const bans: Champion[] = [];
        for(const rawBan of rawBans){
            const champion: Champion = await this.championFetcher.getChampion(rawBan.championId);
            bans.push(champion);
        }
        return bans;
    }

    private getPerformanceStats(rawParticipants: RawCompletedMatchParticipant[], participants: Participant[], minutesPlayed: number): PerformanceStats[] {
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
                minutesPlayed,
                visionScore: rawParticipant.stats.visionScore,
                crowdControlScore: rawParticipant.stats.timeCCingOthers,
                pentakills: rawParticipant.stats.pentaKills
            }
            performances.push(performance);
        }
        return performances;
    }

    private findParticipant(rawParticipant: RawCompletedMatchParticipant, participants: Participant[]): Participant{
        const championIdStr: string = rawParticipant.championId.toString();
        const participant: Participant | undefined = participants.find(x => x.champion.id === championIdStr);
        if(participant)
            return participant;
        else{
            const innerError: Error = new Error(`Could not find a participant which used a champion with ID ${championIdStr} in the RawCompletedMatchData.`);
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