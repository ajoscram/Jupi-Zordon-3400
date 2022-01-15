import "jasmine";
import { AnyBulkWriteOperation, Filter, Sort, UpdateFilter } from "mongodb";
import { IMock, It, Mock, Times } from "typemoq";
import { Dao } from "../../src/mongo/dao";
import { MongoDatabase } from "../../src/mongo/MongoDatabase";
import { Account, ChampionOverallStats, CompletedMatch, OngoingMatch, ServerIdentity, Summoner, SummonerOverallStats, User } from "../../src/core/model";
import { DummyModelFactory } from "../utils";
import { Collection, IndexKey, SortOrder } from "../../src/mongo/enums";
import { BotError, ErrorCode } from "../../src/core/concretions";
import { BulkOperationCreator } from "../../src/mongo/BulkOperationCreator";

describe('MongoDatabase', () => {

    const modelFactory: DummyModelFactory = new DummyModelFactory();
    let database: MongoDatabase;
    let daoMock: IMock<Dao>;

    beforeEach(async () => {
        daoMock = Mock.ofType<Dao>();
        database = new MongoDatabase(daoMock.object);
    });

    it('initialize(): should initialize the DAO in it when both MONGO_URL and DATABASE_NAME are present', async () => {
        const mongoUrl: string = "MONGO_URL";
        const databaseName: string = "DATABASE_NAME";

        process.env.MONGO_URL = mongoUrl;
        process.env.DATABASE_NAME = databaseName;
        await database.initialize();

        daoMock.verify(x => x.initialize(mongoUrl, databaseName), Times.once());
    });

    it('getAccount(): should return the account if the user for it exists', async () => {
        const user: User = modelFactory.createUser();
        const expectedAccount: Account = modelFactory.createAccount();
        const filter: Filter<Account> = { [IndexKey.USER_ID]: user.id };
        daoMock
            .setup(x => x.find(Collection.ACCOUNTS, filter))
            .returns(async () => expectedAccount);

        const actualAccount: Account = await database.getAccount(user);
        
        expect(actualAccount).toBe(expectedAccount);
    });

    it('getAccount(): should fail if the account for the user doesnt exist', async () => {
        const user: User = modelFactory.createUser();
        const filter: Filter<Account> = { [IndexKey.USER_ID]: user.id };
        daoMock
            .setup(x => x.find(Collection.ACCOUNTS, filter))
            .returns(async () => null);

        await expectAsync(database.getAccount(user)).toBeRejectedWith(
            new BotError(ErrorCode.ACCOUNT_NOT_FOUND)
        );
    });

    it('getAccounts(): should return accounts for every user queried', async () => {
        const users: User[] = [ modelFactory.createUser(), modelFactory.createUser() ];
        const expectedAccounts: Account[] = [ modelFactory.createAccount(), modelFactory.createAccount() ];
        const filter: Filter<Account> = {
            $or: users.map(x => { return { [IndexKey.USER_ID]: x.id }; })
        };
        daoMock
            .setup(x => x.count(Collection.ACCOUNTS, filter))
            .returns(async () => users.length);
        daoMock
            .setup(x => x.findMany(Collection.ACCOUNTS, filter))
            .returns(async () => expectedAccounts);

        const actualAccounts: Account[] = await database.getAccounts(users);
        
        expect(actualAccounts).toBe(expectedAccounts);
    });

    it('getAccounts(): should fail if any of the users queried is not found', async () => {
        const users: User[] = [ modelFactory.createUser(), modelFactory.createUser() ];
        const filter: Filter<Account> = {
            $or: users.map(x => { return { [IndexKey.USER_ID]: x.id }; })
        };
        daoMock
            .setup(x => x.count(Collection.ACCOUNTS, filter))
            .returns(async () => users.length - 1);
        
        await expectAsync(database.getAccounts(users)).toBeRejectedWith(
            new BotError(ErrorCode.ACCOUNTS_NOT_FOUND)
        );
    });

    it('getSummonerOverallStats(): should return the stats for a summoner if they have stats recorded', async () => {
        const summoner: Summoner = modelFactory.createSummoner();
        const expectedStats: SummonerOverallStats = modelFactory.createSummonerOverallStats();
        const filter: Filter<SummonerOverallStats> = { [IndexKey.SUMMONER_ID]: summoner.id };
        daoMock
            .setup(x => x.find(Collection.SUMMONER_STATS, filter))
            .returns(async () => expectedStats);

        const actualStats: SummonerOverallStats = await database.getSummonerOverallStats(summoner);
        
        expect(actualStats).toBe(expectedStats);
    });

    it('getSummonerOverallStats(): should fail if the summoner has no recorded stats', async () => {
        const summoner: Summoner = modelFactory.createSummoner();
        const filter: Filter<SummonerOverallStats> = { [IndexKey.SUMMONER_ID]: summoner.id };
        daoMock
            .setup(x => x.find(Collection.SUMMONER_STATS, filter))
            .returns(async () => null);

        await expectAsync(database.getSummonerOverallStats(summoner)).toBeRejectedWith(
            new BotError(ErrorCode.SUMMONER_STATS_NOT_FOUND)
        );
    });

    it('getOngoingMatches(): should return the list of OngoingMatches for the ServerIdentity', async () => {
        const expectedMatches: OngoingMatch[] = [
            modelFactory.createOngoingMatch(),
            modelFactory.createOngoingMatch(),
            modelFactory.createOngoingMatch()
        ]
        const serverIdentity: ServerIdentity = expectedMatches[0].serverIdentity;
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id };
        const sort: Sort = { [IndexKey.DATE]: SortOrder.DESCENDING };
        daoMock
            .setup(x => x.findMany(Collection.ONGOING_MATCHES, filter, sort))
            .returns(async () => expectedMatches);

        const actualMatches: OngoingMatch[] = await database.getOngoingMatches(serverIdentity);

        expect(actualMatches).toBe(expectedMatches);
    });

    it('getOngoingMatch(): returns the match if the index passed in is in range', async () => {
        const matches: OngoingMatch[] = [
            modelFactory.createOngoingMatch(),
            modelFactory.createOngoingMatch(),
            modelFactory.createOngoingMatch()
        ]
        const index: number = 0;
        const serverIdentity: ServerIdentity = matches[index].serverIdentity;
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id };
        const sort: Sort = { [IndexKey.DATE]: SortOrder.DESCENDING };
        daoMock
            .setup(x => x.count(Collection.ONGOING_MATCHES, filter))
            .returns(async () => matches.length);
        daoMock
            .setup(x => x.findMany(Collection.ONGOING_MATCHES, filter, sort))
            .returns(async () => matches);

        const match: OngoingMatch = await database.getOngoingMatch(serverIdentity, index);

        expect(match).toBe(matches[index]);
    });

    it('getOngoingMatch(): fails if the index passed in is less than 0', async () => {
        const index: number = -1;
        const serverIdentity: ServerIdentity = modelFactory.createServerIndentity();

        await expectAsync(database.getOngoingMatch(serverIdentity, index)).toBeRejectedWith(
            new BotError(ErrorCode.ONGOING_MATCH_INDEX_OUT_OF_RANGE)
        );
    });

    it('getOngoingMatch(): fails if the index passed in is greater than or equal to the total amount of ongoing matches recorded', async () => {
        const matchCount: number = 3;
        const index: number = matchCount + 1;
        const serverIdentity: ServerIdentity = modelFactory.createServerIndentity();
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: serverIdentity.id };
        daoMock
            .setup(x => x.count(Collection.ONGOING_MATCHES, filter))
            .returns(async () => matchCount);

        await expectAsync(database.getOngoingMatch(serverIdentity, index)).toBeRejectedWith(
            new BotError(ErrorCode.ONGOING_MATCH_INDEX_OUT_OF_RANGE)
        );
    });

    it('upsertAccount(): should upsert a new account if no errors occur', async () => {
        const account: Account = modelFactory.createAccount();
        const filter: Filter<Account> = {
            [IndexKey.USER_ID]: account.user.id,
            [IndexKey.SUMMONER_ID]: account.summoner.id
        };
        const update: UpdateFilter<Account> = { $set: account };

        await database.upsertAccount(account);
        
        daoMock.verify(x => x.upsert(Collection.ACCOUNTS, filter, update), Times.once());
    });

    it('upsertAccount(): should fail if an error occurs dugin upsertion', async () => {
        const account: Account = modelFactory.createAccount();
        daoMock
            .setup(x => x.upsert(Collection.ACCOUNTS, It.isAny(), It.isAny()))
            .throws(new Error());

        await expectAsync(database.upsertAccount(account)).toBeRejected();
    });

    it('insertOngoingMatch(): should insert a new OngoingMatch if no errors occur', async () => {
        const match: OngoingMatch = modelFactory.createOngoingMatch();
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: match.serverIdentity.id };
        daoMock
            .setup(x => x.count(Collection.ONGOING_MATCHES, filter))
            .returns(async () => 0);
        
        await database.insertOngoingMatch(match);

        daoMock.verify(x => x.insert(Collection.ONGOING_MATCHES, match), Times.once());
    });

    it('insertOngoingMatch(): should fail if the OngoingMatch count for the server reached its limit', async () => {
        const match: OngoingMatch = modelFactory.createOngoingMatch();
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: match.serverIdentity.id };
        daoMock
            .setup(x => x.count(Collection.ONGOING_MATCHES, filter))
            .returns(async () => Number.MAX_SAFE_INTEGER);
        
        await expectAsync(database.insertOngoingMatch(match)).toBeRejectedWith(
            new BotError(ErrorCode.MAX_ONGOING_MATCHES)
        );
    });

    it('insertOngoingMatch(): should fail if an error occurs during insertion', async () => {
        const match: OngoingMatch = modelFactory.createOngoingMatch();
        const filter: Filter<OngoingMatch> = { [IndexKey.SERVERIDENTITY_ID]: match.serverIdentity.id };
        daoMock
            .setup(x => x.count(Collection.ONGOING_MATCHES, filter))
            .returns(async () => 0);
        daoMock
            .setup(x => x.insert(Collection.ONGOING_MATCHES, match))
            .throws(new Error());
        
        await expectAsync(database.insertOngoingMatch(match)).toBeRejected();
    });

    it('deleteOngoingMatches(): should delete every OngoingMatch in the list', async () => {
        const matches: OngoingMatch[] = [
            modelFactory.createOngoingMatch(),
            modelFactory.createOngoingMatch()
        ];
        const filter: Filter<OngoingMatch> = {
            $or: matches.map(x => { return { [IndexKey.ID]: x.id }; })
        };

        await database.deleteOngoingMatches(matches);

        daoMock.verify(x => x.deleteMany(Collection.ONGOING_MATCHES, filter), Times.once());
    });

    it('insertCompletedMatches(): should insert every CompletedMatch in the list and its stats', async () => {
        const matches: CompletedMatch[] = [
            modelFactory.createCompletedMatch(),
            modelFactory.createCompletedMatch()
        ];
        const summonerStatsOperations: AnyBulkWriteOperation<SummonerOverallStats>[] = 
            new BulkOperationCreator().createInsertSummonerStatsOperations(matches);
        const championStatsOperations: AnyBulkWriteOperation<ChampionOverallStats>[] =
            new BulkOperationCreator().createInsertChampionStatsOperations(matches);

        await database.insertCompletedMatches(matches);

        daoMock.verify(x => x.insertMany(Collection.COMPLETED_MATCHES, matches), Times.once());
        daoMock.verify(x => x.bulk(Collection.SUMMONER_STATS, summonerStatsOperations), Times.once());
        daoMock.verify(x => x.bulk(Collection.CHAMPION_STATS, championStatsOperations), Times.once());
    });
});