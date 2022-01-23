import "jasmine";
import { IMock, Mock } from "typemoq";
import { Command, Message } from "../../../../../src/core/interfaces";
import { BalanceTeamsCommand, GetPlayerStatsCommand, HelpCommand, LinkAccountCommand, RecordMatchCommand } from "../../../../../src/core/concretions/commands";
import { DefaultCommandFactory } from "../../../../../src/core/concretions/commands/creation";

describe('DefaultCommandFactory', () => {

    const identifier: string = "!";
    const factory: DefaultCommandFactory = new DefaultCommandFactory(identifier);

    function createCommandVariationStrings(aliases: string[], parameters: string[] = []): string[]{
        const parameterList: string = parameters.reduce((list, parameter) => list + " " + parameter, "");
        return aliases.map( alias => identifier + alias + parameterList);
    }

    function getMockedMessage(content: string): Message{
        const messageMock: IMock<Message> = Mock.ofType<Message>();
        messageMock
            .setup(x => x.getContent())
            .returns(() => content);
        return messageMock.object;
    }

    function getCommandVariations(aliases: string[], parameters: string[] = []): Command[]{
        const variationStrings: string[] = createCommandVariationStrings(aliases, parameters);
        const variations: Command[] = [];
        for(let variation of variationStrings){
            const message: Message = getMockedMessage(variation);
            const command: Command | null = factory.tryCreateCommand(message);
            if(command)
                variations.push(command);
        }
        return variations;
    }

    

    it('tryCreateCommand(): returns a LinkAccountCommand if given its alias', () => {
        getCommandVariations(["link", "l"], ["user", "summoner"])
            .forEach(variation =>
                expect(variation instanceof LinkAccountCommand).toBeTrue()
            );
    });

    it('tryCreateCommand(): returns a BalanceTeamsCommand if given its alias', () => {
        getCommandVariations(["balance", "b"])
            .forEach(variation =>
                expect(variation instanceof BalanceTeamsCommand).toBeTrue()
            );
    });

    it('tryCreateCommand(): returns a RecordMatchCommand if given its alias', () => {
        getCommandVariations(["record", "r"])
            .forEach(variation =>
                expect(variation instanceof RecordMatchCommand).toBeTrue()
            );
    });

    it('tryCreateCommand(): returns a GetPlayerStatsCommand if given its alias', () => {
        getCommandVariations(["stats", "s"])
            .forEach(variation =>
                expect(variation instanceof GetPlayerStatsCommand).toBeTrue()
            );
    });

    it('tryCreateCommand(): returns a HelpCommand if given its alias', () => {
        getCommandVariations(["help", "h"])
            .forEach(variation =>
                expect(variation instanceof HelpCommand).toBeTrue()
            );
    });
});