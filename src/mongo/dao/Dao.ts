import { AnyBulkWriteOperation, BulkWriteResult, Document, Filter } from "mongodb";
import { Collection } from "../enums";

export interface Dao{
    initialize(url: string, database: string): Promise<void>;
    insert(collection: Collection, document: Document): Promise<void>;
    insertMany(collection: Collection, documents: Document[]): Promise<void>;
    upsert(collection: Collection, filter: Filter<Document>, update: Document): Promise<void>;
    find(collection: Collection, filter: Filter<Document>): Promise<Document | null>;
    findMany(collection: Collection, filter: Filter<Document>): Promise<Document[]>;
    bulk(collection: Collection, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult>;
}