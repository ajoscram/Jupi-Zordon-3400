import { Database } from "../core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, ServerIdentity } from "src/core/model";
import { Db, MongoClient, Document } from "mongodb";
import { BotError } from "../core/concretions";
import { ErrorCode } from '../core/concretions/BotError';

export class MongoDatabase implements Database {

    private client: MongoClient;

    private get database(): Db{
        if(!this.client)
            throw this.createBotError("Unable to access the database because the client has not been initialized.");
        if(!process.env.DATABASE_NAME)
            throw this.createBotError("Unable to find the database's name because process.env.DATABASE_NAME was not set.");
        else
            return this.client.db(process.env.DATABASE_NAME, { retryWrites: true });
    }

    async initialize(): Promise<void> {
        if(process.env.MONGO_URL)
            this.client = await MongoClient.connect(process.env.MONGO_URL);
        else
            throw this.createBotError("Unable to connect to the database because process.env.MONGO_URL was not set.");            
    }

    async getAccount(user: User): Promise<Account> {
        const result: Document | null = await this.database.collection("summoner").findOne();
        if (result) {
            return {
                summoner: {
                    id: result.id,
                    name: result.name
                },
                user
            }
        } else {
            throw new BotError(ErrorCode.ACCOUNT_NOT_FOUND);
        }
    }

    async getAccounts(users: User[]): Promise<Account[]> {
        const accounts: Account[] = [];

        for (let element of users) {
            const account: Account = await this.getAccount(element);
            accounts.push(account);
        }

        return accounts;
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

    async upsertAccount(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async deleteOngoingMatch(match: OngoingMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private createBotError(innerErrorMessage: string, code: ErrorCode = ErrorCode.DB_ERROR): BotError{
        const innerError: Error = new Error(innerErrorMessage);
        return new BotError(code, innerError);
    }
/*
    private async insertIntoDb(object: any, collectionName: string) {
        try {
            await this.client
                .db(constantsValues.DATABASE_NAME)
                .collection(collectionName)
                .insertOne(object);

        } catch (e) {
            console.log(e);
            throw new BotError(ErrorCode.DB_ERROR);
        };
    }*/
}