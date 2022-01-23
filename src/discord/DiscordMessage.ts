import { Message, Server } from "../core/abstractions";
import { BotError, ErrorCode } from "../core/concretions";
import { User, Channel, Account, SummonerOverallStats, Prediction, CompletedMatch, OngoingMatch, Attachment } from "../core/model";
import { Presenter } from "./presentation";
import { DiscordServer } from ".";
import { Message as DiscordAPIMessage, GuildChannel, StringResolvable, APIMessage } from "discord.js";

export class DiscordMessage implements Message{

    constructor(
        private readonly message: DiscordAPIMessage,
        private readonly presenter: Presenter
    ){}

    public getServer(): Server{
        if(this.message.guild)
            return new DiscordServer(this.message.guild);
        else
            throw new BotError(ErrorCode.NOT_IN_A_SERVER);
    }

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

    public getAttachments(): Attachment[]{
        const attachments: Attachment[] = [];
        for(const attachment of this.message.attachments.values()){
            attachments.push({
                url: attachment.url,
                name: attachment.name ?? "",
                bytes: attachment.size
            });
        }
        return attachments;
    }

    public async replyWithError(error: ErrorCode): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromError(error);
        await this.message.channel.send(reply);
    }

    public async replyWithTeams(teams: [Account[], Account[]]): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromTeams(teams);
        await this.message.channel.send(reply);
    }

    public async replyWithSummonerStats(stats: SummonerOverallStats): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromSummonerStats(stats);
        await this.message.channel.send(reply);
    }

    public async replyWithRecordedMatch(match: OngoingMatch, prediction: Prediction): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromRecordedMatch(match, prediction);
        await this.message.channel.send(reply);
    }

    public async replyWithKeptMatches(matches: CompletedMatch[]): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromKeptMatches(matches);
        await this.message.channel.send(reply);
    }

    public async replyWithRecordedMatches(matches: OngoingMatch[]): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromRecordedMatches(matches);
        await this.message.channel.send(reply);
    }

    public async replyWithDiscardedMatches(matches: OngoingMatch[]): Promise<void>{
        const reply = this.presenter.createReplyFromDiscardedMatches(matches);
        await this.message.channel.send(reply);
    }

    public async replyWithAccount(account: Account): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromAccount(account);
        await this.message.channel.send(reply);
    }

    public async replyWithHelp(): Promise<void> {
        const reply: StringResolvable | APIMessage = this.presenter.createReplyFromHelp();
        await this.message.channel.send(reply);
    }

    private getGuildChannel(): GuildChannel{
        if(!(this.message.channel instanceof GuildChannel))
            throw new BotError(ErrorCode.NOT_IN_A_SERVER);
        else if(!this.message.channel.isText())
            throw new BotError(ErrorCode.CHANNEL_IS_NOT_TEXT);
        else
            return this.message.channel;
    }
}