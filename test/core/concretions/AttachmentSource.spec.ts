import "jasmine";
import { AttachmentSource, BotError, ErrorCode } from "../../../src/core/concretions";
import { Attachment } from "../../../src/core/model";

describe('AttachmentSource', () => {

    it('getUrls(): should return URLs given all attachments are valid', async () => {
        const attachment: Attachment = { url: "url", name: "file.json", bytes: 1 };
        
        const source: AttachmentSource = new AttachmentSource([ attachment ]);
        const url: string = source.getUrls()[0];

        expect(url).toBe(attachment.url);
    });

    it('getUrls(): should fail with ATTACHMENT_NOT_JSON if the attachments extension isnt ".json"', async () => {
        const attachment: Attachment = { url: "url", name: "file.notjson", bytes: 1 };
        
        const source: AttachmentSource = new AttachmentSource([ attachment ]);
        expect(() => source.getUrls()).toThrow(
            new BotError(ErrorCode.ATTACHMENT_NOT_JSON)
        );
    });

    it('getUrls(): should fail with ATTACHMENT_TOO_LARGE if the attachments number of bytes exceeds one megabyte', async () => {
        const largerThanAMegabyte: number = 1048576 + 1;
        const attachment: Attachment = { url: "url", name: "file.json", bytes: largerThanAMegabyte };
        
        const source: AttachmentSource = new AttachmentSource([ attachment ]);
        expect(() => source.getUrls()).toThrow(
            new BotError(ErrorCode.ATTACHMENT_TOO_LARGE)
        );
    });
});