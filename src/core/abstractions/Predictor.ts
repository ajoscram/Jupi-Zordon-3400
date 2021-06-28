import { OngoingMatch, Player } from "../model";

export interface Predictor{
    balance(player: Player[]): Promise<[Player[], Player[]]>;
    predict(ongoingMatch: OngoingMatch): Promise<number>;
}