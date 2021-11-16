import "jasmine";
import { ConsoleWriter } from "../../../../src/core/concretions/logging";

describe('ConsoleWriter', () => {
    let loggedText: string;
    let consoleWriter: ConsoleWriter;
    
    const originalInfoFunction: (...data: any[]) => void = console.info;
    const originalErrorFunction: (...data: any[]) => void = console.error;
    const originalWarnFunction: (...data: any[]) => void = console.warn;

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
        loggedText = "actual text goes here";
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