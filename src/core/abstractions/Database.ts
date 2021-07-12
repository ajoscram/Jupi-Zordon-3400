import { CompletedMatch, User, OngoingMatch, Account, Summoner, SummonerOverallStats, AIModel } from "../model";

export interface Database{
    initialize(): Promise<void>;
    getAccount(user: User): Promise<Account>;
    getAccounts(users: User[]): Promise<Account[]>;
    getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats>;
    getAIModel(): Promise<AIModel>;
    upsert(account: Account): Promise<void>;
    insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void>;
    insertCompletedMatch(completedMatch: CompletedMatch): Promise<void>;
}