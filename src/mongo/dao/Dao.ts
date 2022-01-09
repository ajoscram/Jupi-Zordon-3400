import { AnyBulkWriteOperation, BulkWriteResult, Document, Filter, Sort } from "mongodb";
import { Collection } from "../enums";

export interface Dao{
    initialize(url: string, database: string): Promise<void>;

    find(collection: Collection, filter: Filter<Document>): Promise<Document | null>;
    findMany(collection: Collection, filter: Filter<Document>, sort?: Sort): Promise<Document[]>;
    count(collection: Collection, filter: Filter<Document>): Promise<number>;

    insert(collection: Collection, document: Document): Promise<void>;
    insertMany(collection: Collection, documents: Document[]): Promise<void>;
    upsert(collection: Collection, filter: Filter<Document>, update: Document): Promise<void>;
    
    deleteMany(collection: Collection, filter: Filter<Document>): Promise<void>;
    
    bulk(collection: Collection, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult>;
}