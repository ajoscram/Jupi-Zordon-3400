import { Champion, Participant } from ".";

export interface Team{
    readonly bans: Champion[],
    readonly participants: Participant[],
}