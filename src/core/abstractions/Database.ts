import { CompletedMatch, User, OngoingMatch, Account, Summoner, SummonerOverallStats, AIModel, ServerIdentity } from "../model";

export interface Database{
    initialize(): Promise<void>;
    getAccount(user: User): Promise<Account>;
    getAccounts(users: User[]): Promise<Account[]>;
    getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats>;
    getAIModel(): Promise<AIModel>;
    getOngoingMatches(serverIdentity: ServerIdentity): Promise<OngoingMatch[]>;
    getOngoingMatch(serverIdentity: ServerIdentity, index: number): Promise<OngoingMatch>;
    upsertAccount(account: Account): Promise<void>;
    insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void>;
    insertCompletedMatch(completedMatch: CompletedMatch): Promise<void>;
    deleteOngoingMatch(matches: OngoingMatch): Promise<void>;
}