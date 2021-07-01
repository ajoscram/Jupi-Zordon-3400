import { Channel, User } from "../model";

export interface Server{
    getUsersInChannel(channel: Channel): User[];
    getUser(name: string): User;
    getChannel(name: string): Channel;
    getServer(): Server;
}