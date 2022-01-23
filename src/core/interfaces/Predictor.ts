import { Account, AIModel, OngoingMatch, Prediction } from "../model";

export interface Predictor{
    initialize(model: AIModel): Promise<void>;
    balance(players: Account[]): Promise<[Account[], Account[]]>;
    predict(ongoingMatch: OngoingMatch): Promise<Prediction>;
}