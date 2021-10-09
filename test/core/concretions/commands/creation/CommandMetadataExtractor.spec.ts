import "jasmine";
import { Message } from "../../../../../src/core/abstractions";
import { CommandMetadata } from "../../../../../src/core/concretions/commands/creation/CommandMetadata";
import { CommandMetadataExtractor } from "../../../../../src/core/concretions/commands/creation/CommandMetadataExtractor";
import { IMock, Mock } from "typemoq";

describe('CommandMetadataExtractor', () => {

    const identifier: string = "+";
    const extractor: CommandMetadataExtractor = new CommandMetadataExtractor(identifier);
    const messageMock: IMock<Message> = Mock.ofType<Message>();

    it('extract(): should extract the CommandMetadata correctly given a message content that starts with the identifier', async () => {
        const tokens: string[] = [ "command", "option1", "option2" ];
        messageMock.setup(x => x.getContent()).returns(() => identifier + tokens.join(" "));

        const metadata: CommandMetadata = extractor.extract(messageMock.object);

        expect(metadata.alias).toBe(tokens[0]);
        expect(metadata.options[0]).toBe(tokens[1]);
        expect(metadata.options[1]).toBe(tokens[2]);
    });

    it('extract(): should return empty CommandMetadata correctly given a message content that doesnt start with the identifier', async () => {
        const tokens: string[] = [ "command", "option1", "option2" ];
        messageMock.setup(x => x.getContent()).returns(() => tokens.join(" "));

        const metadata: CommandMetadata = extractor.extract(messageMock.object);

        expect(metadata.alias).toBe("");
        expect(metadata.options.length).toBe(0);
    });
});