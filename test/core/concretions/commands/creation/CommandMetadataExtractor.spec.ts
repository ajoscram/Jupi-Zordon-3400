import "jasmine";
import { CommandMetadata } from "../../../../../src/core/concretions/commands/creation/CommandMetadata";
import { CommandMetadataExtractor } from "../../../../../src/core/concretions/commands/creation/CommandMetadataExtractor";

describe('CommandMetadataExtractor', () => {

    const identifier: string = "+";
    const extractor: CommandMetadataExtractor = new CommandMetadataExtractor(identifier);

    it('extract(): should extract the CommandMetadata correctly given a message content that starts with the identifier', async () => {
        const tokens: string[] = [ "command", "option1", "\"option2 with spaces\"", "'option3 with spaces'" ];
        const text: string = identifier + tokens.join(" ");

        const metadata: CommandMetadata = extractor.extract(text);

        expect(metadata.alias).toBe(tokens[0]);
        expect(metadata.options[0]).toBe(tokens[1]);
        expect(metadata.options[1]).toBe(tokens[2].replaceAll('"', ''));
        expect(metadata.options[2]).toBe(tokens[3].replaceAll("'", ''));
    });

    it('extract(): should return empty CommandMetadata correctly given a message content that doesnt start with the identifier', async () => {
        const tokens: string[] = [ "command", "option1" ];
        const text: string = tokens.join(" ");

        const metadata: CommandMetadata = extractor.extract(text);

        expect(metadata.alias).toBe("");
        expect(metadata.options.length).toBe(0);
    });
});