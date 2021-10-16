import "jasmine";
import { IMock, Mock, Times } from "typemoq";
import { Writer } from "../../../../src/core/abstractions";
import { Logger } from "../../../../src/core/concretions/logging";

describe('Logger', () => {
    let writerMock: IMock<Writer>;

    beforeEach(async () => {
        writerMock = Mock.ofType<Writer>();
        Logger.add(writerMock.object);
    });

    it('logInformation(): calls logInformation on every writer', async () => {
        const text: string = "information";
        Logger.logInformation(text);
        writerMock.verify(x => x.logInformation(text), Times.once());
    });

    it('logWarning(): calls logWarning on every writer', async () => {
        const text: string = "warning";
        Logger.logWarning(text);
        writerMock.verify(x => x.logWarning(text), Times.once());
    });

    it('logError(): calls logError on every writer', async () => {
        const text: string = "error";
        Logger.logError(text);
        writerMock.verify(x => x.logError(text), Times.once());
    });
});