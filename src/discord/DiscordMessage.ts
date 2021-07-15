import { Message } from "src/core/abstractions";
import { BotError, ErrorCode } from "src/core/concretions";
import { User, Channel, Account, SummonerOverallStats, Prediction, CompletedMatch } from "src/core/model";
import { Message as DiscordAPIMessage, GuildChannel, StringResolvable, APIMessage } from "discord.js";
import { Presenter } from "./presentation";

export class DiscordMessage implements Message{

    constructor(
        private readonly message: DiscordAPIMessage,
        private readonly presenter: Presenter
    ){}

    public getAuthor(): User {
        return { id: this.message.author.id, name: this.message.author.username };
    }

    public getChannel(): Channel {
        const channel: GuildChannel = this.getGuildChannel();
        return { id: channel.id, name: channel.name };
    }

    public getContent(): string {
        return this.message.content;
    }

    public async replyWithError(error: ErrorCode): Promise<void> {
        this.reply(this.presenter.createReplyFromError, error);
    }

    public async replyWithTeams(teams: [Account[], Account[]]): Promise<void> {
        this.reply(this.presenter.createReplyFromTeams, teams);
    }

    public async replyWithSummonerStats(stats: SummonerOverallStats): Promise<void> {
        this.reply(this.presenter.createReplyFromSummonerStats, stats);
    }

    public async replyWithPrediction(prediction: Prediction): Promise<void> {
        this.reply(this.presenter.createReplyFromPrediction, prediction);
    }

    public async replyWithCompletedMatch(match: CompletedMatch): Promise<void> {
        this.reply(this.presenter.createReplyFromCompletedMatch, match);
    }

    public async replyWithAccount(account: Account): Promise<void> {
        this.reply(this.presenter.createReplyFromAccount, account);
    }

    public async replyWithHelp(): Promise<void> {
        this.reply(this.presenter.createReplyFromHelp);
    }

    private getGuildChannel(): GuildChannel{
        if(!(this.message.channel instanceof GuildChannel))
            throw new BotError(ErrorCode.CHANNEL_IS_NOT_IN_A_SERVER);
        else if(!this.message.channel.isText())
            throw new BotError(ErrorCode.CHANNEL_IS_NOT_TEXT);
        else
            return this.message.channel as GuildChannel;
    }

    private async reply(presenter: (...args: any) => StringResolvable | APIMessage, ...args: any): Promise<void>{
        const reply: StringResolvable | APIMessage = presenter(args);
        await this.message.channel.send(reply);
    }
}