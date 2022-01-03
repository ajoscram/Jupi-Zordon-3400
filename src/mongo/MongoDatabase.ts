import { Database } from "../core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, ServerIdentity, Champion, TeamStats } from "src/core/model";
import { BotError } from "../core/concretions";
import { ErrorCode } from '../core/concretions/BotError';
import { Dao } from "./dao";
import { BulkOperationBuilder } from "./BulkOperationBuilder";
import { AnyBulkWriteOperation, BulkWriteResult } from "mongodb";

export class MongoDatabase implements Database {

    public static readonly COMPLETED_MATCHES_COLLECTION: string = "completed_matches";
    public static readonly ONGOING_MATCHES_COLLECTION: string = "ongoing_matches";
    public static readonly SUMMONER_STATS_COLLECTION: string = "summoner_stats";
    public static readonly CHAMPION_STATS_COLLECTION: string = "champion_stats";
    public static readonly ACCOUNTS_COLLECTION: string = "accounts";
    public static readonly STATIC_COLLECTION: string = "static";

    constructor(
        private dao: Dao
    ){}

    async initialize(): Promise<void> {
        if(!process.env.DATABASE_NAME)
            throw this.createBotError("Unable to find the database's name because process.env.DATABASE_NAME was not set.");
        if(!process.env.MONGO_URL)
            throw this.createBotError("Unable to connect to the database because process.env.MONGO_URL was not set.");
        else
            await this.dao.initialize(process.env.MONGO_URL, process.env.DATABASE_NAME);
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
        return {};
    }

    public async getOngoingMatches(serverIdentity: ServerIdentity): Promise<OngoingMatch[]> {
        throw new Error("Method not implemented.");
    }

    public async getOngoingMatch(serverIdentity: ServerIdentity, index: number): Promise<OngoingMatch> {
        throw new Error("Method not implemented.");
    }

    public async upsertAccount(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        //remember to check and handle error where this match is already inserted
        await this.dao.insert(MongoDatabase.COMPLETED_MATCHES_COLLECTION, completedMatch);
        
        const summonerOperations: AnyBulkWriteOperation[] =
            this.createInsertSummonerStatsOperations(completedMatch.blue, completedMatch.minutesPlayed)
                .concat(this.createInsertSummonerStatsOperations(completedMatch.red, completedMatch.minutesPlayed));

        const championOperations: AnyBulkWriteOperation[] =
            this.createInsertBanOperations(completedMatch.blue.bans)
                .concat(this.createInsertBanOperations(completedMatch.red.bans))
                .concat(this.createInsertChampionStatsOperations(completedMatch.blue, completedMatch.minutesPlayed))
                .concat(this.createInsertChampionStatsOperations(completedMatch.red, completedMatch.minutesPlayed));

        const results: PromiseSettledResult<BulkWriteResult>[] = await Promise.allSettled([
            this.dao.bulk(MongoDatabase.SUMMONER_STATS_COLLECTION, summonerOperations),
            this.dao.bulk(MongoDatabase.CHAMPION_STATS_COLLECTION, championOperations)
        ]);

        console.log(results);
    }

    public async deleteOngoingMatch(match: OngoingMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private createInsertBanOperations(bans: Champion[]): AnyBulkWriteOperation[]{
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const ban of bans)
            builder.addInsertBan(ban);
        return builder.build();
    }

    private createInsertChampionStatsOperations(team: TeamStats, minutesPlayed: number): AnyBulkWriteOperation[] {
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const performance of team.performanceStats)
            builder.addInsertChampionStats(performance, team.won, minutesPlayed);
        return builder.build();
    }

    private createInsertSummonerStatsOperations(team: TeamStats, minutesPlayed: number): AnyBulkWriteOperation[] {
        const builder: BulkOperationBuilder = new BulkOperationBuilder();
        for(const performance of team.performanceStats)
            builder.addInsertSummonerStats(performance, team.won, minutesPlayed);
        return builder.build();
    }

    private createBotError(innerErrorMessage: string, code: ErrorCode = ErrorCode.DB_ERROR): BotError{
        const innerError: Error = new Error(innerErrorMessage);
        return new BotError(code, innerError);
    }
}