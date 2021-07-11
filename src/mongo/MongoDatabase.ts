import { Database } from "src/core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch } from "src/core/model";

export class MongoDatabase implements Database {
    initialize(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAccount(user: User): Promise<Account> {
        throw new Error("Method not implemented.");
    }
    getAccounts(users: User[]): Promise<Account[]> {
        throw new Error("Method not implemented.");
    }
    getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        throw new Error("Method not implemented.");
    }
    getAIModel(): AIModel {
        throw new Error("Method not implemented.");
    }
    upsert(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }
    insert(ongoingMatch: OngoingMatch): Promise<void>;
    insert(completedMatch: CompletedMatch): Promise<void>;
    insert(completedMatch: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

}