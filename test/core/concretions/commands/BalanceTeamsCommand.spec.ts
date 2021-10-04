import "jasmine";
import { Account, Channel, User } from "../../../../src/core/model";
import { BalanceTeamsCommand } from "../../../../src/core/concretions/commands";
import { ContextMockBuilder, DummyModelFactory } from "../../../utils";
import { Times } from "typemoq";

describe('BalanceTeamsCommand', () => {
    const dummyFactory: DummyModelFactory = new DummyModelFactory();
    const channel: Channel = dummyFactory.createChannel();
    const accounts: Account[] = [
        dummyFactory.createAccount(),
        dummyFactory.createAccount(),
        dummyFactory.createAccount(),
        dummyFactory.createAccount()
    ];
    const users: User[] = accounts.map(account => account.user);
    const teams: [ Account[], Account[] ] = [
        [accounts[0], accounts[1]],
        [accounts[2], accounts[3]]
    ];
    let contextMockBuilder: ContextMockBuilder;

    beforeEach(async () => {
        contextMockBuilder = new ContextMockBuilder();
        contextMockBuilder.serverMock
            .setup(x => x.getUsersInChannel(channel))
            .returns(() => users);
        contextMockBuilder.databaseMock
            .setup(x => x.getAccounts(users))
            .returns(async () => accounts);
        contextMockBuilder.predictorMock
            .setup(x => x.balance(accounts))
            .returns(async () => teams);
    });

    it('execute(): should reply with the expected teams if given a channel', async () => {
        const channelName: string = "channel name";
        contextMockBuilder.serverMock
            .setup(x => x.getChannel(channelName))
            .returns(() => channel);

        const command: BalanceTeamsCommand = new BalanceTeamsCommand([channelName]);
        await command.execute(contextMockBuilder.context);

        contextMockBuilder.messageMock.verify(x => x.replyWithTeams(teams), Times.once());
    });

    it('execute(): should reply with the expected teams for the message authors current channel if no channel is given', async () => {
        const user: User = dummyFactory.createUser();
        contextMockBuilder.messageMock
            .setup(x => x.getAuthor())
            .returns(() => user);
        contextMockBuilder.serverMock
            .setup(x => x.getCurrentChannel(user))
            .returns(() => channel);

        const command: BalanceTeamsCommand = new BalanceTeamsCommand([]);
        await command.execute(contextMockBuilder.context);

        contextMockBuilder.messageMock.verify(x => x.replyWithTeams(teams), Times.once());
    });
});