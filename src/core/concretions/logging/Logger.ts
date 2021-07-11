import { Writer } from "../../abstractions";

export abstract class Logger{
    private static writers: Writer[] = [];

    public static add(writer: Writer): void{
        Logger.writers.push(writer);
    }
    
    public static logInformation(text: string): void {
        Logger.writers.forEach(
            writer => writer.logInformation(text)
        );
    }
    
    public static logWarning(text: string): void {
        Logger.writers.forEach(
            writer => writer.logWarning(text)
        );
    }
    
    public static logError(text: string): void {
        Logger.writers.forEach(
            writer => writer.logError(text)
        );
    }
}