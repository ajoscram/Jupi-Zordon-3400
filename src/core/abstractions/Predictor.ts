import { Account, OngoingMatch } from "../model";

export interface Predictor{
    balance(players: Account[]): Promise<[Account[], Account[]]>;
    predict(ongoingMatch: OngoingMatch): Promise<number>;
}