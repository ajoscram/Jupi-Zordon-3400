import "jasmine";
import { CommandUtils } from "../../../../src/core/concretions/commands/CommandUtils";
import { Account, Summoner } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../../test/utils";

describe('CommandUtils', () => {
    
    const utils: CommandUtils = new CommandUtils();

    it('getSummoner(): returns a summoner given their name', async () => {
        const summonerName: string = "summoner name";
        const contextMock: ContextMock = new ContextMock();
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => { return { id: "id", name: summonerName }; });
        
        const summoner: Summoner = await utils.getSummoner(contextMock.object, summonerName);

        expect(summoner.name).toBe(summonerName);
    });

    it('getSummoner(): returns the summoner for the current user if no summoner name is given', async () => {
        const account: Account = new DummyModelFactory().createAccount();
        const contextMock: ContextMock = new ContextMock();
        contextMock.messageMock
            .setup(x => x.getAuthor())
            .returns(() => account.user);
        contextMock.databaseMock
            .setup(x => x.getAccount(account.user))
            .returns(async () => account);
        
        const summoner: Summoner = await utils.getSummoner(contextMock.object);
        expect(summoner).toBe(account.summoner);
    });

    it('validateOptionsLength(): doesnt throw if options length is in admissible lengths', async () => {
        const options: string[] = [ "option1", "option2" ];
        const admissibleLengths: number[] = [ 2 ];
        
        utils.validateOptionsLength(options, admissibleLengths);
    });

    it('validateOptionsLength(): throws if options length is not in admissible lengths', async () => {
        const expectedErrorMessage: string = "Incorrect number of arguments passed in. Expected 1 argument(s). Got 2.";
        const options: string[] = [ "option1", "option2" ];
        const admissibleLengths: number[] = [ 1 ];
        
        expect(() => utils.validateOptionsLength(options, admissibleLengths))
            .toThrowError(expectedErrorMessage);
    });
});