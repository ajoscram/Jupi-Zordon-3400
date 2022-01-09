import "jasmine";
import { Dao, MongoDao } from "../../src/mongo/dao";
import { MongoDatabase } from "../../src/mongo/MongoDatabase";
import { Account, Summoner, SummonerOverallStats, User } from "../../src/core/model";
import { DummyModelFactory } from "../utils";

import { config as loadEnvironmentVariables } from "dotenv";

describe('MongoDatabase', () => {

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

    xit('getAccount(): should return the account if the user for it exists', async () => {
        const user: User = modelFactory.createUser();
        const account: Account = await database.getAccount(user);
        expect(account.user).toBe(user);
    });

    xit('getAccount(): should fail if the account for the user doesnt exist', async () => {
        const user: User = modelFactory.createUser();
        const account: Account = await database.getAccount(user);
        expect(account.user).toBe(user);
    });

    xit('getAccounts(): should return accounts for every user queried', async () => {
        const users: User[] = [
            modelFactory.createUser(),
            modelFactory.createUser(),
            modelFactory.createUser()
        ];
        const accounts: Account[] = await database.getAccounts(users);
        console.log(accounts);
    });

    xit('getAccounts(): should fail if any of the users queried is not found', async () => {
        const users: User[] = [
            modelFactory.createUser(),
            modelFactory.createUser(),
            modelFactory.createUser()
        ];
        const accounts: Account[] = await database.getAccounts(users);
        console.log(accounts);
    });

    xit('getSummonerOverallStats(): should return the stats for a summoner if they have stats recorded', async () => {
        const summoner: Summoner = modelFactory.createSummoner();
        const stats: SummonerOverallStats = await database.getSummonerOverallStats(summoner);
        console.log(stats);
    });

    xit('getSummonerOverallStats(): should fail if the summoner has no recorded stats', async () => {
        const summoner: Summoner = modelFactory.createSummoner();
        const stats: SummonerOverallStats = await database.getSummonerOverallStats(summoner);
        console.log(stats);
    });

    xit('upsertAccount(): should add a new account if no errors occur', async () => {
        const account: Account = modelFactory.createAccount();
        await database.upsertAccount(account);
    });

    xit('upsertAccount(): should fail if an error occurs (SPLIT BY ERROR)', async () => {
        const account: Account = modelFactory.createAccount();
        await database.upsertAccount(account);
    });
});