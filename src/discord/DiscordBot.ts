import { Client,Message as DiscordAPIMessage } from "discord.js";
import { Logger } from "../core/concretions/logging";
import { Bot, CommandFactory, Database, MatchFetcher, Message, Predictor, SummonerFetcher } from "../core/abstractions";
import { Context } from "../core/concretions";
import { AIModel } from "../core/model";
import { DiscordMessage } from ".";
import { StringPresenter } from "./presentation";

export class DiscordBot extends Bot{

    private static self: DiscordBot;
    private readonly client: Client;

    public constructor(
        commandFactory: CommandFactory,
        private readonly database: Database,    
        private readonly matchFetcher: MatchFetcher,
        private readonly summonerFetcher: SummonerFetcher,
        private readonly predictor: Predictor
    ){
        super(commandFactory);
        this.client = new Client();
        DiscordBot.self = this;
    }

    public async initialize(): Promise<void> {
        await this.database.initialize();
        const aiModel: AIModel = await this.database.getAIModel();
        await this.predictor.initialize(aiModel);
        
        this.client.on('ready', this.onReady);
        this.client.on('message', this.onMessage);
    }

    public async run(): Promise<void> {
        await this.client.login(process.env.DISCORD_TOKEN);
    }

    protected getContext(message: Message): Context {
        return {
            database: this.database,
            predictor: this.predictor,
            matchFetcher: this.matchFetcher,
            summonerFetcher: this.summonerFetcher,
            message,
            server: message.getServer()
        };
    }

    private onReady(): void{
        Logger.logInformation('Jupi-Zordon 3400 is up and running!');
    }

    private onMessage(message: DiscordAPIMessage): void {
        if(!message.author.bot){
            const wrappedMessage: Message = new DiscordMessage(message, new StringPresenter());
            DiscordBot.self.process(wrappedMessage);
        }
    }
}