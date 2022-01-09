import { AnyBulkWriteOperation, BulkWriteResult, MongoClient, Db, Filter, FindCursor, Sort, OptionalId, UpdateFilter } from "mongodb";
import { BotError, ErrorCode } from "../../../src/core/concretions";
import { Dao } from ".";
import { Collection } from "../enums";

export class MongoDao implements Dao{

    private databaseName: string;
    private client: MongoClient;

    private get database(): Db {
        if(!this.client){
            const innerError: Error = new Error("Unable to access the database because MongoDao has not been initialized.");
            throw new BotError(ErrorCode.DB_ERROR, innerError);
        }
        else
            return this.client.db(this.databaseName);
    }

    public async initialize(url: string, database: string): Promise<void> {
        this.databaseName = database;
        this.client = await MongoClient.connect(url, { retryWrites: true });
        // this is missing mongo options to add connections to the pool
    }

    public async find<T>(collection: Collection, filter: Filter<T>): Promise<T | null> {
        return await this.database.collection<T>(collection).findOne(filter);
    }

    public async findMany<T>(collection: Collection, filter: Filter<T>, sort?: Sort): Promise<T[]> {
        const cursor: FindCursor<T> = sort ?
            this.database.collection<T>(collection).find(filter).sort(sort) :    
            this.database.collection<T>(collection).find(filter);
        const documents: T[] = await cursor.toArray();
        cursor.close();
        return documents;
    }

    public async count<T>(collection: Collection, filter: Filter<T>): Promise<number> {
        return await this.database.collection<T>(collection).countDocuments(filter);
    }

    public async insert<T>(collection: Collection, document: OptionalId<T>): Promise<void> {
        await this.database.collection<T>(collection).insertOne(document);
    }

    public async insertMany<T>(collection: Collection, documents: OptionalId<T>[]): Promise<void> {
        await this.database.collection<T>(collection).insertMany(documents);
    }

    public async upsert<T>(collection: Collection, filter: Filter<T>, update: UpdateFilter<T>): Promise<void> {
        await this.database.collection<T>(collection).updateOne(filter, update, { upsert: true });
    }

    public async deleteMany<T>(collection: Collection, filter: Filter<T>): Promise<void> {
        await this.database.collection<T>(collection).deleteMany(filter);
    }

    public async bulk<T>(collection: Collection, operations: AnyBulkWriteOperation<T>[]): Promise<BulkWriteResult> {
        return await this.database.collection<T>(collection).bulkWrite(operations);
    }
}