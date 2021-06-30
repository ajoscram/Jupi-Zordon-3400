import { CompletedMatch, User, OngoingMatch, Account, Summoner, SummonerOverallStats } from "../model";

export interface Database{
    getAccount(user: User): Promise<Account>;
    getAccounts(users: User[]): Promise<Account[]>;
    getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats>;
    upsert(account: Account): Promise<void>;
    insert(ongoingMatch: OngoingMatch): Promise<void>;
    insert(completedMatch: CompletedMatch): Promise<void>;
}