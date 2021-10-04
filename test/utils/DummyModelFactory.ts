import { Account, Champion, Channel, Summoner, SummonerOverallStats, User, Pick } from "../../src/core/model";

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
        }
    }

    public createSummoner(): Summoner{
        return {
            id: this.createString("summoner id"),
            name: this.createString("summoner name")
        }
    }

    public createAccount(): Account{
        return {
            user: this.createUser(),
            summoner: this.createSummoner()
        }
    }

    public createChampion(): Champion{
        return {
            id: this.createString("champion id"),
            name: this.createString("champion name"),
            picture: this.createString("champion picture")
        }
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
        }
    }

    private createNumber(): number{
        return this.counter++;
    }

    private createString(prefix: string): string{
        return prefix + " " + this.createNumber();
    }

    private createPick(): Pick{
        return {
            champion: this.createChampion(),
            count: this.createNumber()
        }
    }
}