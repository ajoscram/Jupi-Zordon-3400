import { Database } from "../core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch } from "src/core/model";
import { MongoClient } from "mongodb";
import { constantsValues } from './Constants';
import { BotError } from "../core/concretions";
import { ErrorCode } from '../core/concretions/BotError';

export class MongoDatabase implements Database {

    private client: MongoClient;
    public readonly ongoingMatches: OngoingMatch[] = [];

    public readonly completedMatches: CompletedMatch[] = [];

    async initialize(): Promise<void> {
        //client
        const CONNECTION_URL: string = process.env.MONGO_URL || 'MONGO_URL_NOT_FOUND';
        this.client = new MongoClient(CONNECTION_URL);
        await this.client.connect();
    }

    async getAccount(user: User): Promise<Account> {
        const db = this.client.db(constantsValues.DATABASE_NAME);
        const result = await db.collection("summoner").findOne();
        if (result !== null && result !== undefined) {
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

    async upsert(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        console.log(ongoingMatch);
        await this.insertIntoDb(ongoingMatch, constantsValues.ONGOINGMATCHES);
    }

    async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        //INSERT INTO THE DB

    }

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
    }
}