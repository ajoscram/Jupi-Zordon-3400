import { Server } from "../core/abstractions";
import { Channel, User, ServerIdentity } from "../core/model";
import { BotError, ErrorCode } from "../core/concretions";
import { Guild, VoiceChannel, GuildChannel, GuildMember } from 'discord.js';

export class DiscordServer implements Server{

    constructor(
        private readonly guild: Guild
    ){}

    public getUsersInChannel(channel: Channel): User[] {
        const voiceChannel: VoiceChannel = this.getVoiceChannel(channel);
        const users: User[] = [];
        for(let member of voiceChannel.members.values())
            users.push(this.createUser(member));
        return users;
    }

    public getUser(name: string): User {
        for(const member of this.guild.members.cache.values())
            if(member.user.username === name)
                return this.createUser(member);
        throw new BotError(ErrorCode.USER_NOT_FOUND);
    }

    public getChannel(name: string): Channel{
        for(const channel of this.guild.channels.cache.values())
            if(channel.name === name)
                return { id: channel.id, name: channel.name };
        throw new BotError(ErrorCode.CHANNEL_NOT_FOUND);
    }

    public getCurrentChannel(user: User): Channel{
        for(const channel of this.guild.channels.cache.values())
            if(this.isUserInVoiceChannel(user, channel))
                return { id: channel.id, name: channel.name };
        throw new BotError(ErrorCode.USER_NOT_IN_A_VOICE_CHANNEL);
    }

    public getIdentity(): ServerIdentity {
        return { id: this.guild.id, name: this.guild.name }
    }

    private getVoiceChannel(channel: Channel): VoiceChannel{
        const voiceChannel: GuildChannel | undefined = this.guild.channels.cache.get(channel.id);
        if(!voiceChannel)
            throw new BotError(ErrorCode.CHANNEL_NOT_FOUND);
        else if(!(voiceChannel instanceof VoiceChannel))
            throw new BotError(ErrorCode.CHANNEL_IS_NOT_VOICE);
        else
            return voiceChannel;
    }

    private createUser(member: GuildMember): User{
        return { id: member.user.id, name: member.user.username };
    }

    private isUserInVoiceChannel(user: User, channel: GuildChannel): boolean{
        return channel instanceof VoiceChannel && channel.members.get(user.id) != null;
    }
}