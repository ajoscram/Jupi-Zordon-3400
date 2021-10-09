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
            match: this.createOngoingMatch(),
            probabilityBlueWins: this.createNumber(),
            probabilityRedWins: this.createNumber()
        };
    }

    public createCompletedMatch(): CompletedMatch{
        return {
            id: this.createString("completed match id"),
            serverIdentity: this.createServerIndentity(),
            red: this.createTeamStats(),
            blue: this.createTeamStats(),
            minutesPlayed: this.createNumber(),
            date: this.createDate()
        };
    }

    private createTeamStats(): TeamStats{
        return {
            won: false,
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
        return new Date(this.counter++);
    }

    private createNumber(): number{
        return this.counter++;
    }

    private createString(prefix: string): string{
        return prefix + " " + this.createNumber();
    }
}