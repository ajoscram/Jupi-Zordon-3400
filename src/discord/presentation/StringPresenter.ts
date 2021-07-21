import { StringResolvable, APIMessage } from "discord.js";
import { ErrorCode } from "src/core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch } from "src/core/model";
import { Presenter } from ".";
import { errors } from "./english-errors";

export class StringPresenter implements Presenter{

    public createReplyFromError(error: ErrorCode): StringResolvable | APIMessage {
        if(errors[ErrorCode[error]])
            return "ERROR: " + errors[ErrorCode[error]];
        else
            return "ERROR: An unexpected error occurred with code " + ErrorCode[error];
    }

    public createReplyFromTeams(teams: [Account[], Account[]]): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromSummonerStats(stats: SummonerOverallStats): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromPrediction(prediction: Prediction): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromCompletedMatch(match: CompletedMatch): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromAccount(account: Account): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromHelp(): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }
}