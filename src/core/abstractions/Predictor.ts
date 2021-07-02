import { Account, AIModel, OngoingMatch } from "../model";

export interface Predictor{
    initialize(model: AIModel): Promise<void>;
    balance(players: Account[]): Promise<[Account[], Account[]]>;
    predict(ongoingMatch: OngoingMatch): Promise<number>;
}