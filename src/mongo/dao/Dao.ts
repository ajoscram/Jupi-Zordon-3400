import { AnyBulkWriteOperation, BulkWriteResult, Filter, OptionalId, Sort, UpdateFilter } from "mongodb";
import { Collection } from "../enums";

export interface Dao{
    initialize(url: string, database: string): Promise<void>;

    find<T>(collection: Collection, filter: Filter<T>): Promise<T | null>;
    findMany<T>(collection: Collection, filter: Filter<T>, sort?: Sort): Promise<T[]>;
    count<T>(collection: Collection, filter: Filter<T>): Promise<number>;

    insert<T>(collection: Collection, document: OptionalId<T>): Promise<void>;
    insertMany<T>(collection: Collection, documents: OptionalId<T>[]): Promise<void>;
    upsert<T>(collection: Collection, filter: Filter<T>, update: UpdateFilter<T>): Promise<void>;
    
    deleteMany<T>(collection: Collection, filter: Filter<T>): Promise<void>;
    
    bulk<T>(collection: Collection, operations: AnyBulkWriteOperation<T>[]): Promise<BulkWriteResult>;
}