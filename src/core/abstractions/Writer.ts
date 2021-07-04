export interface Writer{
    logInformation(text: string): void;
    logError(text: string): void;
    logWarning(text: string): void;
}