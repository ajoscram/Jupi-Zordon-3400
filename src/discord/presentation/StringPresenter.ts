import { ErrorCode } from "src/core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch } from "src/core/model";
import { Presenter } from ".";
import { ErrorMapper } from "./ErrorMapper";

export class StringPresenter implements Presenter{

    private readonly errorMapper: ErrorMapper = new ErrorMapper();

    public createReplyFromError(error: ErrorCode) {
        return this.errorMapper.map(error);
    }

    public createReplyFromTeams(teams: [Account[], Account[]]) {
        throw new Error("Method not implemented.");
    }

    public createReplyFromSummonerStats(stats: SummonerOverallStats) {
        throw new Error("Method not implemented.");
    }

    public createReplyFromPrediction(prediction: Prediction) {
        throw new Error("Method not implemented.");
    }

    public createReplyFromCompletedMatch(match: CompletedMatch) {
        throw new Error("Method not implemented.");
    }

    public createReplyFromAccount(account: Account) {
        throw new Error("Method not implemented.");
    }

    public createReplyFromHelp() {
        throw new Error("Method not implemented.");
    }
}