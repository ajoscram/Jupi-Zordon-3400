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
        const katarina: Champion = {
            id: "17",
            name: "Katarina",
            picture: "BattleAcademyKatarina.png"
        };
        picksMap.set(katarina, 17);
        return {
            summoner,
            picks: picksMap,
            wins: 17,
            losses: 0,
            assists: 180,
            deaths: 20,
            damageDealtToChampions: 850000,
            damageDealtToObjectives: 700000,
            damageReceived: 1050000,
            gold: 2000000,
            kills: 300,
            minions: 2000,
            minutesPlayed: 425,
            visionScore: 100,
            crowdControlScore: 0
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