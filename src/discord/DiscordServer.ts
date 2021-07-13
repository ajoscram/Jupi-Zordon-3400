import { Server } from "src/core/abstractions";
import { Channel, User, ServerIdentity } from "src/core/model";
import { BotError } from "src/core/concretions";
import { Guild, VoiceChannel, GuildChannel } from 'discord.js';

export class DiscordServer implements Server{

    constructor(
        private readonly guild: Guild
    ){}

    public getUsersInChannel(channel: Channel): User[] {
        const voiceChannel: VoiceChannel = this.getVoiceChannel(channel);
        const users: User[] = [];
        for(let member of voiceChannel.members.values())
            users.push({ id: member.id, name: member.displayName });
        return users;
    }

    public getUser(name: string): User {
        for(const member of this.guild.members.cache.values())
            if(member.displayName == name)
                return { id: member.id, name: member.displayName };
        throw new BotError("");
    }

    public getChannel(name: string): Channel{
        for(const channel of this.guild.channels.cache.values())
            if(channel.name == name)
                return { id: channel.id, name: channel.name };
        throw new BotError("");
    }

    public getIdentity(): ServerIdentity {
        return { id: this.guild.id, name: this.guild.name }
    }

    private getVoiceChannel(channel: Channel): VoiceChannel{
        const voiceChannel: GuildChannel = this.guild.channels.cache.get(channel.id);
        if(!voiceChannel)
            throw new BotError("");
        else if(!(voiceChannel instanceof VoiceChannel))
            throw new BotError("");
        else
            return voiceChannel;
    }
}