import { Database } from "../core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, ServerIdentity } from "src/core/model";
import { ErrorCode } from '../core/concretions';
import { Dao } from "./dao";
import { BulkOperationBuilder } from "./BulkOperationBuilder";
import { AnyBulkWriteOperation, BulkWriteResult, Document, Filter } from "mongodb";
import { ErrorHandler } from "./ErrorHandler";
import { Collection, IndexKey } from "./enums";

export class MongoDatabase implements Database {

    private errorHandler: ErrorHandler = new ErrorHandler();

    constructor(
        private dao: Dao
    ){}

    async initialize(): Promise<void> {
        if(!process.env.DATABASE_NAME)
            throw this.errorHandler.createError("Unable to find the database's name because process.env.DATABASE_NAME was not set.");
        if(!process.env.MONGO_URL)
            throw this.errorHandler.createError("Unable to connect to the database because process.env.MONGO_URL was not set.");
        else
            await this.dao.initialize(process.env.MONGO_URL, process.env.DATABASE_NAME);
    }

    async getAccount(user: User): Promise<Account> {
        const filter: Filter<Document> = { [IndexKey.USER_ID]: user.id };
        const document: Document | null = await this.dao.find(Collection.ACCOUNTS, filter);
        this.errorHandler.throwIfFalsy(document, ErrorCode.ACCOUNT_NOT_FOUND);
        return document as Account;
    }

    async getAccounts(users: User[]): Promise<Account[]> {
        throw new Error("Method not implemented.");
    }

    async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        const filter: Filter<Document> = { [IndexKey.SUMMONER_ID]: summoner.id };
        const document: Document | null = await this.dao.find(Collection.SUMMONER_STATS, filter);
        this.errorHandler.throwIfFalsy(document, ErrorCode.SUMMONER_STATS_NOT_FOUND);
        return document as SummonerOverallStats;
    }

    async getAIModel(): Promise<AIModel> {
        return {};
    }

    public async getOngoingMatches(serverIdentity: ServerIdentity): Promise<OngoingMatch[]> {
        throw new Error("Method not implemented.");
    }

    public async getOngoingMatch(serverIdentity: ServerIdentity, index: number): Promise<OngoingMatch> {
        throw new Error("Method not implemented.");
    }

    public async upsertAccount(account: Account): Promise<void> {
        try{
            const filter: Filter<Document> = {
                [IndexKey.USER_ID]: account.user.id,
                [IndexKey.SUMMONER_ID]: account.summoner.id
            };
            const update: Document = {
                $set: {
                    summoner: account.summoner,
                    user: account.user
                }
            };
            await this.dao.upsert(Collection.ACCOUNTS, filter, update);
        } catch(error) {
            throw this.errorHandler.handleUpsertAccountError(error);
        }
    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        await this.dao.insert(Collection.ONGOING_MATCHES, ongoingMatch);
    }

    public async insertCompletedMatches(completedMatches: CompletedMatch[]): Promise<void> {
        await this.dao.insertMany(Collection.COMPLETED_MATCHES, completedMatches);
        await this.insertStatsForCompletedMatches(completedMatches);
    }

    public async deleteOngoingMatches(matches: OngoingMatch[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async insertStatsForCompletedMatches(completedMatches: CompletedMatch[]): Promise<void>{
        const summonerOperations: AnyBulkWriteOperation[] = this.getSummonerStatsOperations(completedMatches);
        const championOperations: AnyBulkWriteOperation[] = this.getChampionStatsOperations(completedMatches);

        const results: PromiseSettledResult<BulkWriteResult>[] = await Promise.allSettled([
            this.dao.bulk(Collection.SUMMONER_STATS, summonerOperations),
            this.dao.bulk(Collection.CHAMPION_STATS, championOperations)
        ]);

        this.errorHandler.throwIfCompletedMatchStatsInsertionErrors(results);
    }

    private getSummonerStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation[] {
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const match of completedMatches){
            builder
                .addInsertSummonerStatsOperations(match.blue, match.minutesPlayed)
                .addInsertSummonerStatsOperations(match.red, match.minutesPlayed);
        }
        return builder.build();
    }

    private getChampionStatsOperations(completedMatches: CompletedMatch[]): AnyBulkWriteOperation[] {
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