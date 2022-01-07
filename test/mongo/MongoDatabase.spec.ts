import "jasmine";
import { Dao, MongoDao } from "../../src/mongo/dao";
import { MongoDatabase } from "../../src/mongo/MongoDatabase";
import { Account } from "../../src/core/model";
import { DummyModelFactory } from "../utils";

import { config as loadEnvironmentVariables } from "dotenv";

xdescribe('MongoDatabase', () => {

    let modelFactory: DummyModelFactory = new DummyModelFactory();
    let database: MongoDatabase;
    let dao: Dao;

    beforeEach(async () => {
        loadEnvironmentVariables();
        modelFactory = new DummyModelFactory();
        dao = new MongoDao();
        database = new MongoDatabase(dao);
        await database.initialize();
    });

    it('upsertAccount(): should add a new account if no errors occur', async () => {
        const account: Account = modelFactory.createAccount();
        await database.upsertAccount(account);
    });

    it('upsertAccount(): should fail if an error occurs', async () => {
        const account: Account = modelFactory.createAccount();
        await database.upsertAccount(account);
    });
});