import { Predictor } from "src/core/abstractions";
import { AIModel, Account, OngoingMatch, Prediction } from "src/core/model";

export class MockPredictor implements Predictor {
    public async initialize(model: AIModel): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async balance(players: Account[]): Promise<[Account[], Account[]]> {
        throw new Error("Method not implemented.");
    }
    public async predict(ongoingMatch: OngoingMatch): Promise<Prediction> {
        throw new Error("Method not implemented.");
    }
}