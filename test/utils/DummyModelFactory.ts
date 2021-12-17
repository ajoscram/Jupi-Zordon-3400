import { RawChampion, RawChampionContainer, RawOngoingMatch, RawOngoingMatchParticipant, RawSummoner, TeamId } from "../../src/riot/model";
import { Account, Champion, Channel, Summoner, SummonerOverallStats, User, Pick, ServerIdentity, OngoingMatch, Participant, Prediction, CompletedMatch, TeamStats, PerformanceStats, Role } from "../../src/core/model";

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
            id: this.createString("summoner id"),
            name: this.createString("summoner name")
        };
    }

    public createAccount(): Account{
        return {
            user: this.createUser(),
            summoner: this.createSummoner()
        };
    }

    public createChampion(): Champion{
        return {
            id: this.createString("champion id"),
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
        return{
            id: this.createString("ongoing match id"),
            date: this.createDate(),
            serverIdentity: this.createServerIndentity(),
            blue: [
                this.createParticipant(),
                this.createParticipant(),
                this.createParticipant(),
                this.createParticipant(),
                this.createParticipant(),
            ],
            red: [
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
            accountId: this.createString("raw summoner accountId"),
            name: this.createString("raw summoner id")
        };
    }

    public createRawOngoingMatch(gameType: string): RawOngoingMatch {
        return {
            gameId: this.createNumber(),
            gameStartTime: this.createNumber(),
            gameType,
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
            ]
        };
    }

    private createRawOngoingMatchParticipant(teamId: TeamId): RawOngoingMatchParticipant{
        return {
            teamId: teamId,
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
            minutesPlayed: this.createNumber(),
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
        return new Date(0);
    }

    private createNumber(): number{
        return this.counter++;
    }

    private createString(prefix: string): string{
        return prefix + " " + this.createNumber();
    }
}