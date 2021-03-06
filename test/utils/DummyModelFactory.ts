import { RawBan, RawChampion, RawChampionContainer, RawCompletedMatch, RawCompletedMatchParticipant, RawLane, RawOngoingMatch, RawOngoingMatchParticipant, RawRole, RawStats, RawSummoner, RawTeam, RawTimeline, TeamId } from "../../src/riot/model";
import { Account, Champion, Channel, Summoner, SummonerOverallStats, User, Pick, ServerIdentity, OngoingMatch, Participant, Prediction, CompletedMatch, TeamStats, PerformanceStats, Role, Team, Attachment } from "../../src/core/model";

export class DummyModelFactory{
    private counter: number = 0;

    public createChannel(): Channel{
        return {
            id: this.createString("channel id"),
            name: this.createString("channel name")
        };
    }

    public createUser(): User{
        return {
            id: this.createString("user id"),
            name: this.createString("user name")
        };
    }

    public createSummoner(): Summoner{
        return {
            id: this.createNumber().toString(),
            name: this.createString("summoner name")
        };
    }

    public createAccount(): Account{
        return {
            user: this.createUser(),
            summoner: this.createSummoner()
        };
    }

    public createChampion(id?: number): Champion{
        return {
            id: (id ?? this.createNumber()).toString(),
            name: this.createString("champion name"),
            picture: this.createString("champion picture")
        };
    }

    public createSummonerOverallStats(): SummonerOverallStats{
        return {
            summoner: this.createSummoner(),
            picks: [
                this.createPick(),
                this.createPick()
            ],
            wins: this.createNumber(),
            losses: this.createNumber(),
            assists: this.createNumber(),
            deaths: this.createNumber(),
            damageDealtToChampions: this.createNumber(),
            damageDealtToObjectives: this.createNumber(),
            damageReceived: this.createNumber(),
            gold: this.createNumber(),
            kills: this.createNumber(),
            minions: this.createNumber(),
            minutesPlayed: this.createNumber(),
            visionScore: this.createNumber(),
            crowdControlScore: this.createNumber(),
            pentakills: this.createNumber()
        };
    }

    public createServerIndentity(): ServerIdentity{
        return {
            id: this.createString("server id"),
            name: this.createString("server name")
        };
    }

    public createOngoingMatch(): OngoingMatch{
        return {
            id: this.createNumber().toString(),
            date: this.createDate(),
            serverIdentity: this.createServerIndentity(),
            blue: this.createTeam(),
            red: this.createTeam()
        };
    }

    public createTeam(): Team{
        return {
            bans: [
                this.createChampion(),
                this.createChampion(),
                this.createChampion(),
            ],
            participants: [
                this.createParticipant(),
                this.createParticipant(),
                this.createParticipant(),
                this.createParticipant(),
                this.createParticipant(),
            ]
        };
    }

    public createPrediction(): Prediction{
        return {
            probabilityBlueWins: this.createNumber(),
            probabilityRedWins: this.createNumber()
        };
    }

    public createCompletedMatch(): CompletedMatch{
        return {
            id: this.createString("completed match id"),
            serverIdentity: this.createServerIndentity(),
            red: this.createTeamStats(false),
            blue: this.createTeamStats(true),
            minutesPlayed: this.createNumber(),
            date: this.createDate()
        };
    }

    public createRawChampionContainer(): RawChampionContainer {
        return {
            data: {
                champion1: this.createRawChampion(),
                champion2: this.createRawChampion(),
                champion3: this.createRawChampion(),
            }
        };
    }

    public createRawSummoner(): RawSummoner {
        return {
            id: this.createString("raw summoner id"),
            name: this.createString("raw summoner id")
        };
    }

    public createRawOngoingMatch(gameType?: string, gameMode?: string): RawOngoingMatch {
        return {
            gameId: this.createNumber(),
            platformId: "LA1",
            gameStartTime: this.createNumber(),
            gameType: gameType ?? "CUSTOM_GAME",
            gameMode: gameMode ?? "CLASSIC",
            participants: [
                this.createRawOngoingMatchParticipant(TeamId.BLUE),
                this.createRawOngoingMatchParticipant(TeamId.BLUE),
                this.createRawOngoingMatchParticipant(TeamId.BLUE),
                this.createRawOngoingMatchParticipant(TeamId.BLUE),
                this.createRawOngoingMatchParticipant(TeamId.BLUE),
                this.createRawOngoingMatchParticipant(TeamId.RED),
                this.createRawOngoingMatchParticipant(TeamId.RED),
                this.createRawOngoingMatchParticipant(TeamId.RED),
                this.createRawOngoingMatchParticipant(TeamId.RED),
                this.createRawOngoingMatchParticipant(TeamId.RED)
            ],
            bannedChampions:[
                this.createRawBan(TeamId.BLUE),
                this.createRawBan(TeamId.BLUE),
                this.createRawBan(TeamId.BLUE),
                this.createRawBan(TeamId.RED),
                this.createRawBan(TeamId.RED),
                this.createRawBan(TeamId.RED),
            ]
        };
    }

    public createRawCompletedMatch(ongoingMatch?: OngoingMatch, includeRedTeam: boolean = true, includeCorrectChampionIds: boolean = true): RawCompletedMatch {
        ongoingMatch = ongoingMatch ?? this.createOngoingMatch();
        const teams: RawTeam[] = [ this.createRawTeam(TeamId.BLUE) ];
        const participants: RawCompletedMatchParticipant[] = ongoingMatch.blue.participants.map(x => 
            this.createRawCompletedMatchParticipant(TeamId.BLUE, x, includeCorrectChampionIds));
        
        if(includeRedTeam){
            teams.push(this.createRawTeam(TeamId.RED));
            for(const participant of ongoingMatch.red.participants)
                participants.push(this.createRawCompletedMatchParticipant(TeamId.RED, participant, includeCorrectChampionIds));
        }

        return {
            gameId: Number.parseInt(ongoingMatch.id),
            platformId: "LA1",
            gameType: "CUSTOM_GAME",
            gameMode: "CLASSIC",
            gameCreation: this.createNumber(),
            gameDuration: this.createNumber(),
            teams,
            participants: participants
        };
    }

    public createAttachment(): Attachment{
        return {
            name: this.createString("attachment name"),
            url: this.createString("attachment url"),
            bytes: this.createNumber()
        };
    }

    private createRawTeam(teamId: TeamId): RawTeam{
        return {
            teamId,
            win: teamId == TeamId.BLUE ? "Win" : "Loss",
            towerKills: this.createNumber(),
            baronKills: this.createNumber(),
            dragonKills: this.createNumber(),
            riftHeraldKills: this.createNumber(),
        };
    }

    private createRawBan(teamId: TeamId): RawBan{
        return {
            championId: this.createNumber(),
            teamId,
        };
    }

    private createRawCompletedMatchParticipant(teamId: TeamId, participant: Participant, includeCorrectChampionIds: boolean): RawCompletedMatchParticipant{
        return {
            teamId,
            championId: includeCorrectChampionIds ? Number.parseInt(participant.champion.id) : -1,
            participantId: Number.parseInt(participant.summoner.id),
            stats: this.createRawStats(),
            timeline: this.createRawTimeline()
        }
    }

    private createRawStats(): RawStats{
        return {
            kills: this.createNumber(),
            deaths: this.createNumber(),
            assists: this.createNumber(),
            largestKillingSpree: this.createNumber(),
            largestMultiKill: this.createNumber(),
            pentaKills: this.createNumber(),
            totalDamageDealtToChampions: this.createNumber(),
            damageDealtToObjectives: this.createNumber(),
            visionScore: this.createNumber(),
            timeCCingOthers: this.createNumber(),
            totalDamageTaken: this.createNumber(),
            goldEarned: this.createNumber(),
            totalMinionsKilled: this.createNumber(),
            neutralMinionsKilled: this.createNumber(),
            firstBloodKill: false,
            firstTowerKill: false
        };
    }

    private createRawTimeline(): RawTimeline{
        return {
            role: RawRole.SOLO,
            lane: RawLane.MIDDLE
        };
    }

    private createRawOngoingMatchParticipant(teamId: TeamId): RawOngoingMatchParticipant{
        return {
            teamId,
            championId: this.createNumber(),
            summonerId: this.createString("raw ongoing match participant id"),
            summonerName: this.createString("raw ongoing match participant name")
        };
    }

    private createRawChampion(): RawChampion {
        return {
            key: this.createNumber().toString(),
            name: this.createString("raw champion name"),
            image: {
                full: this.createString("raw champion image")
            }
        };
    }

    private createTeamStats(won: boolean): TeamStats{
        return {
            won,
            dragons: this.createNumber(),
            heralds: this.createNumber(),
            barons: this.createNumber(),
            towers: this.createNumber(),
            bans: [
                this.createChampion(),
                this.createChampion(),
                this.createChampion(),
                this.createChampion(),
                this.createChampion(),
            ],
            performanceStats: [
                this.createPerformanceStats(),
                this.createPerformanceStats(),
                this.createPerformanceStats(),
                this.createPerformanceStats(),
                this.createPerformanceStats(),
            ]
        };
    }

    private createPerformanceStats(): PerformanceStats{
        return {
            summoner: this.createSummoner(),
            champion: this.createChampion(),
            largestMultikill: this.createNumber(),
            largestKillingSpree: this.createNumber(),
            firstBlood: false,
            firstTower: false,
            role: Role.UNKNOWN,
            assists: this.createNumber(),
            deaths: this.createNumber(),
            damageDealtToChampions: this.createNumber(),
            damageDealtToObjectives: this.createNumber(),
            damageReceived: this.createNumber(),
            gold: this.createNumber(),
            kills: this.createNumber(),
            minions: this.createNumber(),
            visionScore: this.createNumber(),
            crowdControlScore: this.createNumber(),
            pentakills: this.createNumber()
        };
    }

    private createParticipant(): Participant{
        return {
            summoner: this.createSummoner(),
            champion: this.createChampion()
        };
    }

    private createPick(): Pick{
        return {
            champion: this.createChampion(),
            count: this.createNumber()
        };
    }

    private createDate(): Date{
        // this "seconds" variable is needed so that both local and CI dates
        // are printed the same for the StringPresenter tests
        const seconds: number = 86300000;
        return new Date(seconds);
    }

    private createNumber(): number{
        return this.counter++;
    }

    private createString(prefix: string): string{
        return prefix + " " + this.createNumber();
    }
}