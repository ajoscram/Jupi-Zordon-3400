import { OngoingMatch, Player } from "../model";

export interface Predictor{
    balance(player: Player[]): [Player[], Player[]];
    predict(ongoingMatch: OngoingMatch): number;
}