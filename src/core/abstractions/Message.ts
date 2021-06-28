import { Channel, DiscordUser, Server } from '../model'

export interface Message{
    getCommandOptions(): string[];
    getInvoker(): DiscordUser;
    getInvokingChannel(): Channel;
    getUsersInChannel(channel: Channel): DiscordUser[];
    getUser(name: string): DiscordUser;
    getChannel(name: string): Channel;
    getServer(): Server;
    reply(text: string): void;
}