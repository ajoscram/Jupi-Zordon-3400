import "jasmine";
import { ConsoleWriter } from "../../../../src/core/concretions/logging";

describe('ConsoleWriter', () => {
    let loggedText: string;
    let consoleWriter: ConsoleWriter;
    
    let originalInfoFunction: (...data: any[]) => void = console.info;
    let originalErrorFunction: (...data: any[]) => void = console.error;
    let originalWarnFunction: (...data: any[]) => void = console.warn;

    function intercept(...data: any[]): void {
        loggedText = data[0];
    }

    beforeAll(() => {
        console.info = intercept;
        console.error = intercept;
        console.warn = intercept;
    });

    beforeEach(async () => {
        consoleWriter = new ConsoleWriter();
        loggedText = "actual text";
    });

    it('logInformation: should log the via console.info', async () => {
        const text = "information";
        consoleWriter.logInformation(text);
        expect(loggedText).toBe(text);
    });

    it('logError: should log the via console.error', async () => {
        const text = "error";
        consoleWriter.logError(text);
        expect(loggedText).toBe(text);
    });

    it('logWarning: should log the via console.warn', async () => {
        const text = "warning";
        consoleWriter.logWarning(text);
        expect(loggedText).toBe(text);
    });

    afterAll(() => {
        console.info = originalInfoFunction;
        console.error = originalErrorFunction;
        console.warn = originalWarnFunction;
    });
});