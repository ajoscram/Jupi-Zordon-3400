import { AnyBulkWriteOperation, Document, BulkWriteResult, MongoClient, Db, Filter, FindCursor, Sort } from "mongodb";
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

    public async find(collection: Collection, filter: Filter<Document>): Promise<Document | null> {
        return await this.database.collection(collection).findOne(filter);
    }

    public async findMany(collection: Collection, filter: Filter<Document>, sort?: Sort): Promise<Document[]> {
        const cursor: FindCursor = sort ?
            this.database.collection(collection).find(filter).sort(sort) :    
            this.database.collection(collection).find(filter);
        const documents: Document[] = await cursor.toArray();
        cursor.close();
        return documents;
    }

    public async count(collection: Collection, filter: Filter<Document>): Promise<number> {
        return await this.database.collection(collection).countDocuments(filter);
    }

    public async insert(collection: Collection, document: Document): Promise<void> {
        await this.database.collection(collection).insertOne(document);
    }

    public async insertMany(collection: Collection, documents: Document[]): Promise<void> {
        await this.database.collection(collection).insertMany(documents);
    }

    public async upsert(collection: Collection, filter: Filter<Document>, update: Document): Promise<void> {
        await this.database.collection(collection).updateOne(filter, update, { upsert: true });
    }

    public async deleteMany(collection: Collection, filter: Filter<Document>): Promise<void> {
        await this.database.collection(collection).deleteMany(filter);
    }

    public async bulk(collection: Collection, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult> {
        return await this.database.collection(collection).bulkWrite(operations);
    }
}