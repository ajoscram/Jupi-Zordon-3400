import { Database } from "src/core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch } from "src/core/model";

export class MockDatabase implements Database {

    public readonly ongoingMatches: OngoingMatch[] = [];

    public async initialize(): Promise<void> { }

    public async getAccount(user: User): Promise<Account> {
        throw new Error("Method not implemented.");
    }
   
    public async getAccounts(users: User[]): Promise<Account[]> {
        throw new Error("Method not implemented.");
    }
    
    public async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        throw new Error("Method not implemented.");
    }
   
    public async getAIModel(): Promise<AIModel> {
        throw new Error("Method not implemented.");
    }
   
    public async upsert(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        this.ongoingMatches.push(ongoingMatch);
    }

    public async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }
}