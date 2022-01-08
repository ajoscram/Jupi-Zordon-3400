import { AnyBulkWriteOperation, Document, BulkWriteResult, MongoClient, Db, Filter, FindCursor, MongoError } from "mongodb";
import { BotError, ErrorCode } from "../../../src/core/concretions";
import { Dao } from ".";
import { Collection } from "../enums";

export class MongoDao implements Dao{

    public static readonly CURSOR_COUNT_MISMATCH_ERROR_MESSAGE: string = "FIND_CURSOR_COUNT_MISMATCH_ERROR_MESSAGE";

    private databaseName: string;
    private client: MongoClient;

    private get database(): Db {
        if(!this.client){
            const innerError: Error = new Error("Unable to access the database because DefaultDao has not been initialized.");
            throw new BotError(ErrorCode.DB_ERROR, innerError);
        }
        else
            return this.client.db(this.databaseName, { retryWrites: true });
    }

    public async initialize(url: string, database: string): Promise<void> {
        this.databaseName = database;
        this.client = await MongoClient.connect(url);
        // this is missing mongo options to add connections to the pool
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

    public async find(collection: Collection, filter: Filter<Document>): Promise<Document | null> {
        return await this.database.collection(collection).findOne(filter);
    }

    public async findMany(collection: Collection, filter: Filter<Document>, expectedCount?: number): Promise<Document[]> {
        const cursor: FindCursor = await this.database.collection(collection).find(filter);
        await this.validateCursorCount(cursor, expectedCount);
        const documents: Document[] = await cursor.toArray();
        cursor.close();
        return documents;
    }

    public async bulk(collection: Collection, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult> {
        return await this.database.collection(collection).bulkWrite(operations);
    }

    private async validateCursorCount(cursor: FindCursor, expectedCount?: number): Promise<void>{
        if(expectedCount && expectedCount !== await cursor.count()){
            cursor.close();
            throw new MongoError(MongoDao.CURSOR_COUNT_MISMATCH_ERROR_MESSAGE);
        }
    }
}