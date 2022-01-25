import "jasmine";
import { BotError, ErrorCode } from "../../../../src/core/concretions";
import { CommandUtils } from "../../../../src/core/concretions/commands/CommandUtils";
import { Account, OngoingMatch, ServerIdentity, Summoner } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../../test/utils";

describe('CommandUtils', () => {
    const dummyFactory: DummyModelFactory = new DummyModelFactory();
    const serverIdentity: ServerIdentity = dummyFactory.createServerIndentity();
    let contextMock: ContextMock = new ContextMock();

    beforeEach(() => {
        contextMock = new ContextMock();
        contextMock.serverMock
            .setup(x => x.getIdentity())
            .returns(() => serverIdentity);
    });

    it('getSummoner(): returns a summoner given their name', async () => {
        const summonerName: string = "summoner name";
        const expectedSummoner: Summoner = dummyFactory.createSummoner();
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => expectedSummoner);
        
        const summoner: Summoner = await CommandUtils.getSummoner(contextMock.object, summonerName);

        expect(summoner).toBe(expectedSummoner);
    });

    it('getSummoner(): returns the summoner for the current user if no summoner name is given', async () => {
        const account: Account = dummyFactory.createAccount();
        contextMock.messageMock
            .setup(x => x.getAuthor())
            .returns(() => account.user);
        contextMock.databaseMock
            .setup(x => x.getAccount(account.user))
            .returns(async () => account);
        
        const summoner: Summoner = await CommandUtils.getSummoner(contextMock.object);
        expect(summoner).toBe(account.summoner);
    });

    it('getOngoingMatches(): returns ongoing matches for the server in the context if no match index is given', async () =>{
        const expectedMatches: OngoingMatch[] = [
            dummyFactory.createOngoingMatch(),
            dummyFactory.createOngoingMatch(),
            dummyFactory.createOngoingMatch(),
        ];
        contextMock.databaseMock
            .setup(x => x.getOngoingMatches(serverIdentity))
            .returns(async () => expectedMatches);
        
        const matches: OngoingMatch[] = await CommandUtils.getOngoingMatches(contextMock.object);

        expect(matches).toBe(expectedMatches);
    });

    it('getOngoingMatches(): returns a list with only one match if a non-zero index is given', async () =>{
        testForIndex(1);
    });

    it('getOngoingMatches(): returns a list with only one match if its index is 0', async () =>{
        testForIndex(0);
    });

    it('validateOptionsLength(): doesnt throw if options length is in admissible lengths', async () => {
        const options: string[] = [ "option1", "option2" ];
        const admissibleLengths: number[] = [ 2 ];
        
        CommandUtils.validateOptionsLength(options, admissibleLengths);
    });

    it('validateOptionsLength(): throws if options length is not in admissible lengths', async () => {
        const options: string[] = [ "option1", "option2" ];
        const admissibleLengths: number[] = [ 1 ];
        
        expect(() => CommandUtils.validateOptionsLength(options, admissibleLengths))
            .toThrow(new BotError(ErrorCode.COMMAND_ARGUMENT_COUNT));
    });

    it('parseIndex(): returns a number if the input string is an integer', async () => {
        const index: string = "0"; // selected on purpose because 0 is falsy in JS

        const int: number = CommandUtils.parseIndex(index);

        expect(int).toBe(Number.parseInt(index));
    });

    it('parseIndex(): throws if the input string is not an integer', async () => {
        const index: string = "not an integer";

        expect(() => CommandUtils.parseIndex(index))
            .toThrow( new BotError(ErrorCode.INDEX_NOT_NUMBER));
    });

    async function testForIndex(index: number): Promise<void>{
        const expectedMatch: OngoingMatch = dummyFactory.createOngoingMatch();
        contextMock.databaseMock
            .setup(x => x.getOngoingMatch(serverIdentity, index))
            .returns(async () => expectedMatch);
        
        const matches: OngoingMatch[] = await CommandUtils.getOngoingMatches(contextMock.object, index);

        expect(matches.length).toBe(1);
        expect(matches[0]).toBe(expectedMatch);
    }
});