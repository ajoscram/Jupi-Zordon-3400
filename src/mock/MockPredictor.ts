import { Predictor } from "src/core/abstractions";
import { AIModel, Account, OngoingMatch, Prediction } from "src/core/model";

export class MockPredictor implements Predictor {
    public async initialize(model: AIModel): Promise<void> {
        //Here will be load the model in the real predictor
    }
    public async balance(players: Account[]): Promise<[Account[], Account[]]> { 
        const teamSplitter: number = Math.floor( players.length/2 ); 
        return [players.slice(0,teamSplitter),players.slice(teamSplitter)];
    }
    public async predict(ongoingMatch: OngoingMatch): Promise<Prediction> {
        return {
            match: ongoingMatch,
            probabilityBlueWins: 0.5,
            probabilityRedWins: 0.5
        };
    }
}