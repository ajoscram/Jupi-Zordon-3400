import { Message } from "src/core/abstractions";
import { BotError, ErrorCode } from "src/core/concretions";
import { User, Channel, Account, SummonerOverallStats, Prediction, CompletedMatch } from "src/core/model";
import { Message as DiscordAPIMessage, GuildChannel } from "discord.js";

export class DiscordMessage implements Message{

    constructor(
        private readonly message: DiscordAPIMessage
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
        throw new Error("Method not implemented.");
    }

    public async replyWithTeams(teams: [Account[], Account[]]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async replyWithSummonerStats(stats: SummonerOverallStats): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async replyWithPrediction(prediction: Prediction): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async replyWithCompletedMatch(match: CompletedMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async replyWithAccount(account: Account): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async replyWithHelp(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private getGuildChannel(): GuildChannel{
        if(!(this.message.channel instanceof GuildChannel))
            throw new BotError(ErrorCode.CHANNEL_IS_NOT_IN_A_SERVER);
        else if(!this.message.channel.isText())
            throw new BotError(ErrorCode.CHANNEL_IS_NOT_TEXT);
        else
            return this.message.channel as GuildChannel;
    }
}