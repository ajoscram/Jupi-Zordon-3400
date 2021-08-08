import { Database } from "src/core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, Champion } from "src/core/model";

export class MockDatabase implements Database {

    private id: number = 0;

    public readonly ongoingMatches: OngoingMatch[] = [];

    public readonly completedMatches: CompletedMatch[] = [];

    public readonly accounts: Account[] = [];

    public async initialize(): Promise<void> { }

    public async getAccount(user: User): Promise<Account> {
        return {
            summoner: {
                id: "" + this.id++,
                name: "summoner_name"
            },
            user
        };
    }

    public async getAccounts(users: User[]): Promise<Account[]> {
        const accounts: Account[] = [];

        for (let element of users) {
            const account: Account = await this.getAccount(element);
            accounts.push(account);
        }

        return accounts;
    }

    public async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        const picksMap = new Map<Champion,number>();
        picksMap.set({ id: "17", name: "Katarina", picture: "Katarina.png" }, 17);
        picksMap.set({ id: "18", name: "Illaoi", picture: "Illaoi.png" }, 30);
        picksMap.set({ id: "19", name: "Yuumi", picture: "Yuumi.png" }, 1);
        picksMap.set({ id: "20", name: "Ezreal", picture: "Ezreal.png" }, 13);
        picksMap.set({ id: "21", name: "Cho'Gath", picture: "Cho'Gath.png" }, 24);
        return {
            summoner,
            picks: picksMap,
            wins: 17,
            losses: 10,
            assists: 180,
            deaths: 200,
            damageDealtToChampions: 850000,
            damageDealtToObjectives: 700000,
            damageReceived: 1050000,
            gold: 200123,
            kills: 300,
            minions: 2000,
            minutesPlayed: 425,
            visionScore: 100,
            crowdControlScore: 200,
            pentakills: 3
        };
    }

    public async getAIModel(): Promise<AIModel> {
        return {};
    }

    public async upsert(account: Account): Promise<void> {
        //Check if account is created to update it or add it
        const desiredAccount: Account|undefined = this.accounts.find(element => 
            element.summoner.id === account.summoner.id &&
            element.user.id === account.user.id);

        if (desiredAccount) {
            //update
            const index = this.accounts.indexOf(desiredAccount);
            this.accounts[index] = account;
        } else {
            //insert
            this.accounts.push(account);
        }

    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        this.ongoingMatches.push(ongoingMatch);
    }

    public async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        this.completedMatches.push(completedMatch);
    }
}