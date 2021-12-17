import { APIMessage, StringResolvable } from "discord.js";
import { ErrorCode } from "src/core/concretions";
import { Account, CompletedMatch, OngoingMatch, Prediction, SummonerOverallStats } from "src/core/model";

export interface Presenter{
    createReplyFromError(error: ErrorCode): StringResolvable | APIMessage;
    createReplyFromTeams(teams: [Account[], Account[]]): StringResolvable | APIMessage;
    createReplyFromSummonerStats(stats: SummonerOverallStats): StringResolvable | APIMessage;
    createReplyFromRecordedMatch(match: OngoingMatch, prediction: Prediction): StringResolvable | APIMessage;
    createReplyFromKeptMatches(matches: CompletedMatch[]): StringResolvable | APIMessage;
    createReplyFromRecordedMatches(matches: OngoingMatch[]): StringResolvable | APIMessage;
    createReplyFromDiscardedMatches(matches: OngoingMatch[]): StringResolvable | APIMessage;
    createReplyFromAccount(account: Account): StringResolvable | APIMessage;
    createReplyFromHelp(): StringResolvable | APIMessage;
}