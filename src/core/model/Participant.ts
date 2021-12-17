import { Champion, Summoner } from ".";

export interface Participant {
    readonly summoner: Summoner,
    readonly champion: Champion
}