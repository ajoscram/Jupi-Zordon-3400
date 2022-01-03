import { AnyBulkWriteOperation, BulkWriteResult, Document } from "mongodb";

export interface Dao{
    initialize(url: string, database: string): Promise<void>;
    insert(collection: string, document: Document): Promise<void>;
    bulk(collection: string, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult>;
}