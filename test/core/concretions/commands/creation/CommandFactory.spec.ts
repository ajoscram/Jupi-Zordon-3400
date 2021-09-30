import "jasmine";
import { Command, Message } from "../../../../../src/core/abstractions";
import { BalanceTeamsCommand, GetPlayerStatsCommand, HelpCommand, LinkAccountCommand, RecordMatchCommand } from "../../../../../src/core/concretions/commands";
import { CommandFactory } from "../../../../../src/core/concretions/commands/creation";
import { MockMessage } from "../../../../../src/mock";

describe('CommandFactory', () => {

    const identifier: string = "!";
    const factory: CommandFactory = new CommandFactory(identifier);

    function createCommandVariationStrings(aliases: string[], parameters: string[] = []): string[]{
        const parameterList: string = parameters.reduce((list, parameter) => list + " " + parameter, "");
        return aliases.map( alias => identifier + alias + parameterList);
    }

    function getCommandVariations(aliases: string[], parameters: string[] = []): Command[]{
        const variationStrings: string[] = createCommandVariationStrings(aliases, parameters);
        const variations: Command[] = [];
        for(let variation of variationStrings){
            const message: Message = new MockMessage(variation);
            const command: Command = factory.tryCreateCommand(message);
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

    it('tryCreateCommand(): returns a LinkAccountCommand if given its alias', () => {
        getCommandVariations(["record", "r"])
            .forEach(variation =>
                expect(variation instanceof RecordMatchCommand).toBeTrue()
            );
    });

    it('tryCreateCommand(): returns a LinkAccountCommand if given its alias', () => {
        getCommandVariations(["stats", "s"])
            .forEach(variation =>
                expect(variation instanceof GetPlayerStatsCommand).toBeTrue()
            );
    });

    it('tryCreateCommand(): returns a LinkAccountCommand if given its alias', () => {
        getCommandVariations(["help", "h"])
            .forEach(variation =>
                expect(variation instanceof HelpCommand).toBeTrue()
            );
    });
});