import { Server } from "src/core/interfaces";
import { Channel, User, ServerIdentity } from "src/core/model";

export class MockServer implements Server{
    public getUsersInChannel(channel: Channel): User[] {
        const users: User[] = [];
        for(let i = 0; i < 10; i++)
            users.push({ id: "user_id_" + i, name: "user_name_" + i });
        return users;
    }

    public getUser(name: string): User {
        return { id: "user_id", name }
    }

    public getChannel(name: string): Channel {
        return { id: "channel_id", name }
    }

    public getCurrentChannel(user: User): Channel {
        return { id: "channel_id", name: "channel_name" };
    }

    public getIdentity(): ServerIdentity {
        return { id: "server_id", name: "server_name" }
    }
}