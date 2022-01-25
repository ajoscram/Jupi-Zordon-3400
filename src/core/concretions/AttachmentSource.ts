import { BotError, ErrorCode } from ".";
import { Source } from "../interfaces";
import { Attachment } from "../model";

export class AttachmentSource implements Source{

    private static readonly MAX_BYTES: number = 1048576; //1MB
    private static readonly JSON_EXTENSION: string = ".json";

    constructor(
        private readonly attachments: Attachment[]
    ){ }

    public getUrls(): string[] {
        return this.attachments.map( x => this.getUrl(x));
    }

    private getUrl(attachment: Attachment): string {
        if(attachment.bytes > AttachmentSource.MAX_BYTES)
            throw new BotError(ErrorCode.ATTACHMENT_TOO_LARGE);
        else if(!attachment.name.endsWith(AttachmentSource.JSON_EXTENSION))
            throw new BotError(ErrorCode.ATTACHMENT_NOT_JSON);
        else
            return attachment.url;
    }
}