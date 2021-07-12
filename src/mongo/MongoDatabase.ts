import { Database } from "src/core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch } from "src/core/model";

export class MongoDatabase implements Database {
    async initialize(): Promise<void> {
        throw new Error("Method not implemented.");
    }

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

    async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }
}