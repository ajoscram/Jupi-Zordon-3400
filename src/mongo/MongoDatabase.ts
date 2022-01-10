import { AnyBulkWriteOperation, BulkWriteResult, Filter, Sort, UpdateFilter } from "mongodb";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, ServerIdentity, ChampionOverallStats } from "src/core/model";
import { Database } from "../core/abstractions";
import { BotError, ErrorCode } from '../core/concretions';
import { Dao } from "./dao";
import { BulkOperationBuilder } from "./BulkOperationBuilder";
import { ErrorResolver } from "./ErrorResolver";
import { Collection, IndexKey, SortOrder } from "./enums";

export class MongoDatabase implements Database {

    private static readonly MAX_ONGOING_MATCHES_ALLOWED: number = 4;

    private errorResolver: ErrorResolver = new ErrorResolver();

    constructor(
        private dao: Dao
    ){}

    public async initialize(): Promise<void> {
        if(!process.env.DATABASE_NAME)
            throw this.errorResolver.createError("Unable to find the database's name because process.env.DATABASE_NAME was not set.");
        else if(!process.env.MONGO_URL)
            throw this.errorResolver.createError("Unable to connect to the database because process.env.MONGO_URL was not set.");
        else if(!process.env.APP_NAME)
            throw this.errorResolver.createError("Unable to start due to the app name not being specified.");
        else
            await this.dao.initialize(process.env.MONGO_URL, process.env.DATABASE_NAME);
    }

    public async getAccount(user: User): Promise<Account> {
        const filter: Filter<Account> = { [IndexKey.USER_ID]: user.id };
        const account: Account | null = await this.dao.find(Collection.ACCOUNTS, filter);
        if(!account)
            throw new BotError(ErrorCode.ACCOUNT_NOT_FOUND);
        else
            return account;
    }

    public async getAccounts(users: User[]): Promise<Account[]> {
        const filter: Filter<Account> = this.getOrFilter(users, IndexKey.USER_ID, user => user.id) as Filter<Account>;
        await this.validateAccountCount(filter, users.length);
        return await this.dao.findMany(Collection.ACCOUNTS, filter);
    }

    public async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        const filter: Filter<SummonerOverallStats> = { [IndexKey.SUMMONER_ID]: summoner.id };
        const stats: SummonerOverallStats | null = await this.dao.find(Collection.SUMMONER_STATS, filter);
        if(!stats)
            throw new BotError(ErrorCode.SUMMONER_STATS_NOT_FOUND);
        else
            return stats;
    }

    public async getAIModel(): Promise<AIModel> {
        return {};
    }

    public async getOngoingMatches(serverIdentity: ServerIdentity): Promise<OngoingMatch[]> {
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id };
        const sort: Sort = { [IndexKey.DATE]: SortOrder.DESCENDING };
        return await this.dao.findMany(Collection.ONGOING_MATCHES, filter, sort);
    }

    public async getOngoingMatch(serverIdentity: ServerIdentity, index: number): Promise<OngoingMatch> {
        const count: number = await this.getOngoingMatchCount(serverIdentity);
        if(index < 0 || index >= count)
            throw new BotError(ErrorCode.ONGOING_MATCH_INDEX_OUT_OF_RANGE);
        const matches: OngoingMatch[] = await this.getOngoingMatches(serverIdentity);
        return matches[index];
    }

    public async upsertAccount(account: Account): Promise<void> {
        try{
            const filter: Filter<Account> = {
                [IndexKey.USER_ID]: account.user.id,
                [IndexKey.SUMMONER_ID]: account.summoner.id
            };
            const update: UpdateFilter<Account> = { $set: account };
            await this.dao.upsert(Collection.ACCOUNTS, filter, update);
        } catch(error) {
            throw this.errorResolver.handleUpsertAccountError(error);
        }
    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        try{
            const count: number = await this.getOngoingMatchCount(ongoingMatch.serverIdentity);
            if(count >= MongoDatabase.MAX_ONGOING_MATCHES_ALLOWED)
                throw new BotError(ErrorCode.MAX_ONGOING_MATCHES);
            await this.dao.insert(Collection.ONGOING_MATCHES, ongoingMatch);
        } catch(error) {
            throw this.errorResolver.handleInsertOngoingMatchError(error);
        }
    }

    public async insertCompletedMatches(completedMatches: CompletedMatch[]): Promise<void> {
        await this.dao.insertMany(Collection.COMPLETED_MATCHES, completedMatches);
        await this.insertStatsForCompletedMatches(completedMatches);
    }

    public async deleteOngoingMatches(matches: OngoingMatch[]): Promise<void> {
        const filter: Filter<OngoingMatch> = this.getOrFilter(matches, IndexKey.ID, match => match.id);
        await this.dao.deleteMany(Collection.ONGOING_MATCHES, filter);
    }

    private getOrFilter<T>(array: T[], key: IndexKey, valueFunction: (element: T) => string): Filter<T>{
        const innerFilters: Filter<T>[] = array.map(x => {
            return { [key]: valueFunction(x) };
        }) as Filter<T>[];

        if(innerFilters.length == 1)
            return innerFilters[0];
        else
            return { $or: innerFilters };
    }

    private async getOngoingMatchCount(serverIdentity: ServerIdentity): Promise<number>{
        return await this.dao.count(
            Collection.ONGOING_MATCHES,
            { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id }
        );
    }

    private async validateAccountCount(filter: Filter<Account>, expectedCount: number): Promise<void>{
        const actualCount: number = await this.dao.count(Collection.ACCOUNTS, filter);
        if(actualCount !== expectedCount)
            throw new BotError(ErrorCode.ACCOUNTS_NOT_FOUND);
    }

    private async insertStatsForCompletedMatches(completedMatches: CompletedMatch[]): Promise<void>{
        const summonerOperations: AnyBulkWriteOperation<SummonerOverallStats>[] = this.createSummonerStatsOperations(completedMatches);
        const championOperations: AnyBulkWriteOperation<ChampionOverallStats>[] = this.createChampionStatsOperations(completedMatches);

        const results: PromiseSettledResult<BulkWriteResult>[] = await Promise.allSettled([
            this.dao.bulk(Collection.SUMMONER_STATS, summonerOperations),
            this.dao.bulk(Collection.CHAMPION_STATS, championOperations)
        ]);

        this.throwIfCompletedMatchStatsInsertionErrors(results);
    }

    private createSummonerStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation<SummonerOverallStats>[] {
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const match of completedMatches){
            builder
                .addInsertSummonerStatsOperations(match.blue, match.minutesPlayed)
                .addInsertSummonerStatsOperations(match.red, match.minutesPlayed);
        }
        return builder.build();
    }

    private createChampionStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation<ChampionOverallStats>[] {
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const match of completedMatches){
            builder
                .addInsertBanOperations(match.blue.bans)
                .addInsertBanOperations(match.red.bans)
                .addInsertChampionStatsOperations(match.blue, match.minutesPlayed)
                .addInsertChampionStatsOperations(match.red, match.minutesPlayed);
        }
        return builder.build();  
    }

    private throwIfCompletedMatchStatsInsertionErrors(insertionResults: PromiseSettledResult<BulkWriteResult>[]): void{
        console.log(insertionResults);
    }
}