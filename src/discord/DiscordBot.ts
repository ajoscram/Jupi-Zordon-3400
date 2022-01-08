import { Client,Message as DiscordAPIMessage } from "discord.js";
import { Logger } from "../core/concretions/logging";
import { Bot, CommandFactory, Database, MatchFetcher, Message, Predictor, SummonerFetcher } from "../core/abstractions";
import { Context } from "../core/concretions";
import { AIModel } from "../core/model";
import { DiscordMessage } from ".";
import { StringPresenter } from "./presentation";

export class DiscordBot extends Bot{

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
    }

    public async initialize(): Promise<void> {
        await this.database.initialize();
        const aiModel: AIModel = await this.database.getAIModel();
        await this.predictor.initialize(aiModel);
        
        const self: DiscordBot = this; //forced to assign this 'self' var because of JS binding BS
        this.client.on('ready', () => Logger.logInformation('Jupi-Zordon 3400 is up and running!'));
        this.client.on('message', (message: DiscordAPIMessage) => {
            if(!message.author.bot){
                const wrappedMessage: Message = new DiscordMessage(message, new StringPresenter());
                self.process(wrappedMessage);
            }
        });
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
}