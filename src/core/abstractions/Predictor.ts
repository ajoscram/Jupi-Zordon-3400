import { Account, AIModel, OngoingMatch } from "../model";

type ProbabilityBlueWins = number;

export interface Predictor{
    initialize(model: AIModel): Promise<void>;
    balance(players: Account[]): Promise<[Account[], Account[]]>;
    predict(ongoingMatch: OngoingMatch): Promise<ProbabilityBlueWins>;
}