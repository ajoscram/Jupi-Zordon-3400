import { Channel, User, ServerIdentity } from "../model";

export interface Server{
    getUsersInChannel(channel: Channel): User[];
    getUser(name: string): User;
    getChannel(name: string): Channel;
    getCurrentChannel(user: User): Channel;
    getIdentity(): ServerIdentity;
}