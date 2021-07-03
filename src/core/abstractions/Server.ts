import { Channel, User, ServerIdentity } from "../model";

export interface Server{
    run(): Promise<void>;
    getUsersInChannel(channel: Channel): User[];
    getUser(name: string): User;
    getChannel(name: string): Channel;
    getIdentity(): ServerIdentity;
}