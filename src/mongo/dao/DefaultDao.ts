import { AnyBulkWriteOperation, Document, BulkWriteResult, MongoClient, Db } from "mongodb";
import { BotError, ErrorCode } from "src/core/concretions";
import { Dao } from ".";

export class DefaultDao implements Dao{

    private databaseName: string;
    private client: MongoClient;

    private get database(): Db{
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

    public async insert(collection: string, document: Document): Promise<void> {
        await this.database.collection(collection).insertOne(document);
    }

    public async bulk(collection: string, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult> {
        return await this.database.collection(collection).bulkWrite(operations);
    }
}