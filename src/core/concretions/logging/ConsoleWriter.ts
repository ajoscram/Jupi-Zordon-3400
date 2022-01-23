import { Writer } from "../../interfaces";

export class ConsoleWriter implements Writer{
    
    logInformation(text: string): void {
        console.info(text);
    }

    logError(text: string): void {
        console.error(text);
    }

    logWarning(text: string): void {
        console.warn(text);
    }
}