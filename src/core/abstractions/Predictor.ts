import { Account, OngoingMatch } from "../model";
import { AIModelSource } from ".";

export interface Predictor{
    initialize(source: AIModelSource): Promise<void>;
    balance(players: Account[]): Promise<[Account[], Account[]]>;
    predict(ongoingMatch: OngoingMatch): Promise<number>;
}