import { Database } from "src/core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch } from "src/core/model";

export class MockDatabase implements Database {
    private ongoingMatches: OngoingMatch[] = [];

    async initialize(): Promise<void> {}

    async getAccount(user: User): Promise<Account> {
        throw new Error("Method not implemented.");
    }
   
    async getAccounts(users: User[]): Promise<Account[]> {
        throw new Error("Method not implemented.");
    }
    
    async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        throw new Error("Method not implemented.");
    }
   
    async getAIModel(): Promise<AIModel> {
        throw new Error("Method not implemented.");
    }
   
    async upsert(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }
   
    async insert(ongoingMatch: OngoingMatch): Promise<void>{
        this.ongoingMatches.push(ongoingMatch);

    }
   
    async insert(completedMatch: CompletedMatch): Promise<void>{
        throw new Error("Method not implemented.");
    }

}