import { OngoingMatch } from ".";

export interface Prediction{
    readonly match: OngoingMatch;
    readonly probabilityBlueWins: number,
    readonly probabilityRedWins: number
}