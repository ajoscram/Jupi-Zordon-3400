import { Writer } from "../../abstractions";

export class Logger implements Writer{
    private writers: Writer[] = [];

    add(writer: Writer): void{
        this.writers.push(writer);
    }

    logInformation(text: string): void {
        this.writers.forEach(
            writer => writer.logInformation(text)
        );
    }

    logWarning(text: string): void {
        this.writers.forEach(
            writer => writer.logWarning(text)
        );
    }

    logError(text: string): void {
        this.writers.forEach(
            writer => writer.logError(text)
        );
    }
}