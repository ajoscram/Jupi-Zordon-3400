import { APIMessage, StringResolvable } from "discord.js";
import { ErrorCode } from "src/core/concretions";
import { Account, CompletedMatch, Prediction, SummonerOverallStats } from "src/core/model";

export interface Presenter{
    createReplyFromError(error: ErrorCode): StringResolvable | APIMessage;
    createReplyFromTeams(teams: [Account[], Account[]]): StringResolvable | APIMessage;
    createReplyFromSummonerStats(stats: SummonerOverallStats): StringResolvable | APIMessage;
    createReplyFromPrediction(prediction: Prediction): StringResolvable | APIMessage;
    createReplyFromCompletedMatch(match: CompletedMatch): StringResolvable | APIMessage;
    createReplyFromAccount(account: Account): StringResolvable | APIMessage;
    createReplyFromHelp(): StringResolvable | APIMessage;
}