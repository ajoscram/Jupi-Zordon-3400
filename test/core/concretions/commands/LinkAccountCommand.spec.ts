import "jasmine";
import { Times } from "typemoq";
import { LinkAccountCommand } from "../../../../src/core/concretions/commands";
import { Account } from "../../../../src/core/model";
import { ContextMock, DummyModelFactory } from "../../../utils";

describe('LinkAccountCommand', () => {
    const contextMock: ContextMock = new ContextMock();
    const dummyFactory: DummyModelFactory = new DummyModelFactory();

    it('execute(): should reply with the account added', async () => {
        const username: string = "user name";
        const summonerName: string = "summoner name";
        const account: Account = dummyFactory.createAccount();
        contextMock.serverMock
            .setup(x => x.getUser(username))
            .returns(() => account.user);
        contextMock.summonerFetcherMock
            .setup(x => x.getSummoner(summonerName))
            .returns(async () => account.summoner)

        const command: LinkAccountCommand = new LinkAccountCommand([username, summonerName]);
        await command.execute(contextMock.object);

        contextMock.databaseMock.verify(x => x.upsert(account), Times.once());
        contextMock.messageMock.verify(x => x.replyWithAccount(account), Times.once());
    });
});