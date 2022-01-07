import "jasmine";
import { Times } from "typemoq";
import { LinkAccountCommand } from "../../../../src/core/concretions/commands";
import { Account } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('LinkAccountCommand', () => {
    const contextMock: ContextMock = new ContextMock();
    const dummyFactory: DummyModelFactory = new DummyModelFactory();

    it('execute(): should search for the User in the Server and reply with the account added if the username is passed in', async () => {
        const summonerName: string = "summoner name";
        const username: string = "user name";
        const account: Account = dummyFactory.createAccount();
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => account.summoner);
        contextMock.serverMock
            .setup(x => x.getUser(username))
            .returns(() => account.user);

        const command: LinkAccountCommand = new LinkAccountCommand([summonerName, username]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.upsertAccount(account), Times.once());
        contextMock.messageMock.verify(x => x.replyWithAccount(account), Times.once());
    });

    it('execute(): should use the messages author and reply with the account added', async () => {
        const summonerName: string = "summoner name";
        const account: Account = dummyFactory.createAccount();
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => account.summoner);
        contextMock.messageMock
            .setup(x => x.getAuthor())
            .returns(() => account.user);

        const command: LinkAccountCommand = new LinkAccountCommand([summonerName]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.upsertAccount(account), Times.once());
        contextMock.messageMock.verify(x => x.replyWithAccount(account), Times.once());
    });
});