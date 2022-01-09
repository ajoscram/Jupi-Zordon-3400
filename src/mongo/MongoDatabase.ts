import { Database } from "../core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, ServerIdentity } from "src/core/model";
import { ErrorCode } from '../core/concretions';
import { Dao } from "./dao";
import { BulkOperationBuilder } from "./BulkOperationBuilder";
import { AnyBulkWriteOperation, BulkWriteResult, Document, Filter, Sort } from "mongodb";
import { ErrorResolver } from "./ErrorResolver";
import { Collection, IndexKey, SortOrder } from "./enums";
import { Thrower } from "./Thrower";

export class MongoDatabase implements Database {

    private errorResolver: ErrorResolver = new ErrorResolver();
    private thrower: Thrower = new Thrower();

    constructor(
        private dao: Dao
    ){}

    async initialize(): Promise<void> {
        if(!process.env.DATABASE_NAME)
            throw this.errorResolver.createError("Unable to find the database's name because process.env.DATABASE_NAME was not set.");
        if(!process.env.MONGO_URL)
            throw this.errorResolver.createError("Unable to connect to the database because process.env.MONGO_URL was not set.");
        else
            await this.dao.initialize(process.env.MONGO_URL, process.env.DATABASE_NAME);
    }

    async getAccount(user: User): Promise<Account> {
        const filter: Filter<Document> = { [IndexKey.USER_ID]: user.id };
        const document: Document | null = await this.dao.find(Collection.ACCOUNTS, filter);
        this.thrower.throwIfFalsy(document, ErrorCode.ACCOUNT_NOT_FOUND);
        return document as Account;
    }

    async getAccounts(users: User[]): Promise<Account[]> {
        const filter: Filter<Document> = this.getOrFilter(users, IndexKey.USER_ID, user => user.id);
        await this.validateAccountCount(filter, users.length);
        const documents: Document[] = await this.dao.findMany(Collection.ACCOUNTS, filter);
        return documents.map(document => document as Account);
    }

    async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        const filter: Filter<Document> = { [IndexKey.SUMMONER_ID]: summoner.id };
        const document: Document | null = await this.dao.find(Collection.SUMMONER_STATS, filter);
        this.thrower.throwIfFalsy(document, ErrorCode.SUMMONER_STATS_NOT_FOUND);
        return document as SummonerOverallStats;
    }

    async getAIModel(): Promise<AIModel> {
        return {};
    }

    public async getOngoingMatches(serverIdentity: ServerIdentity): Promise<OngoingMatch[]> {
        const filter: Filter<Document> = { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id };
        const sort: Sort = { [IndexKey.DATE]: SortOrder.DESCENDING };
        const documents: Document[] = await this.dao.findMany(Collection.ONGOING_MATCHES, filter, sort);
        return documents.map(document => document as OngoingMatch);
    }

    public async getOngoingMatch(serverIdentity: ServerIdentity, index: number): Promise<OngoingMatch> {
        const count: number = await this.getOngoingMatchCount(serverIdentity);
        this.thrower.throwIfOngoingMatchIndexIsOutOfRange(index, count);
        const matches: OngoingMatch[] = await this.getOngoingMatches(serverIdentity);
        return matches[index];
    }

    public async upsertAccount(account: Account): Promise<void> {
        try{
            const filter: Filter<Document> = {
                [IndexKey.USER_ID]: account.user.id,
                [IndexKey.SUMMONER_ID]: account.summoner.id
            };
            const update: Document = { $set: account };
            await this.dao.upsert(Collection.ACCOUNTS, filter, update);
        } catch(error) {
            throw this.errorResolver.handleUpsertAccountError(error);
        }
    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        try{
            const count: number = await this.getOngoingMatchCount(ongoingMatch.serverIdentity);
            this.thrower.throwIfMaxMatchesReached(count);
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
        const filter: Filter<Document> = this.getOrFilter(matches, IndexKey.ID, match => match.id);
        await this.dao.deleteMany(Collection.ONGOING_MATCHES, filter);
    }

    private getOrFilter<T>(array: T[], key: IndexKey, valueFunction: (element: T) => string): Filter<Document>{
        const innerFilters: Filter<Document>[] = array.map(x => {
            return { [key]: valueFunction(x) };
        });

        if(innerFilters.length == 1)
            return innerFilters;
        else
            return { $or:  innerFilters };
    }

    private async getOngoingMatchCount(serverIdentity: ServerIdentity): Promise<number>{
        return await this.dao.count(
            Collection.ONGOING_MATCHES,
            { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id }
        );
    }

    private async validateAccountCount(filter: Filter<Document>, expectedCount: number): Promise<void>{
        const actualCount: number = await this.dao.count(Collection.ACCOUNTS, filter);
        this.thrower.throwIfAccountCountIsNotExpected(actualCount, expectedCount);
    }

    private async insertStatsForCompletedMatches(completedMatches: CompletedMatch[]): Promise<void>{
        const summonerOperations: AnyBulkWriteOperation[] = this.createSummonerStatsOperations(completedMatches);
        const championOperations: AnyBulkWriteOperation[] = this.createChampionStatsOperations(completedMatches);

        const results: PromiseSettledResult<BulkWriteResult>[] = await Promise.allSettled([
            this.dao.bulk(Collection.SUMMONER_STATS, summonerOperations),
            this.dao.bulk(Collection.CHAMPION_STATS, championOperations)
        ]);

        this.thrower.throwIfCompletedMatchStatsInsertionErrors(results);
    }

    private createSummonerStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation[] {
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const match of completedMatches){
            builder
                .addInsertSummonerStatsOperations(match.blue, match.minutesPlayed)
                .addInsertSummonerStatsOperations(match.red, match.minutesPlayed);
        }
        return builder.build();
    }

    private createChampionStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation[] {
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
}