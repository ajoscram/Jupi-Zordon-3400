import "jasmine";
import { CommandUtils } from "../../../../src/core/concretions/commands/CommandUtils";
import { Account, Summoner } from "../../../../src/core/model";
import { ContextMockBuilder, DummyModelFactory } from "../../../../test/utils";

describe('CommandUtils', () => {
    
    const utils: CommandUtils = new CommandUtils();

    it('getSummoner(): returns a summoner given their name', async () => {
        const summonerName: string = "summoner name";
        const contextMockBuilder: ContextMockBuilder = new ContextMockBuilder();
        contextMockBuilder.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => { return { id: "id", name: summonerName }; });
        
        const summoner: Summoner = await utils.getSummoner(contextMockBuilder.context, summonerName);

        expect(summoner.name).toBe(summonerName);
    });

    it('getSummoner(): returns the summoner for the current user if no summoner name is given', async () => {
        const account: Account = new DummyModelFactory().createAccount();
        const contextMockBuilder: ContextMockBuilder = new ContextMockBuilder();
        contextMockBuilder.messageMock
            .setup(x => x.getAuthor())
            .returns(() => account.user);
        contextMockBuilder.databaseMock
            .setup(x => x.getAccount(account.user))
            .returns(async () => account);
        
        const summoner: Summoner = await utils.getSummoner(contextMockBuilder.context);
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