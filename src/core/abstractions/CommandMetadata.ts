export interface CommandMetadataSource{
    getCommandToken(): string;
    getCommandOptions(): string[];
}