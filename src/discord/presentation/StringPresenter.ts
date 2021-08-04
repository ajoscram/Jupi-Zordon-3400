import { StringResolvable, APIMessage } from "discord.js";
import { ErrorCode } from "src/core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch } from "src/core/model";
import { Presenter } from ".";
import { errors } from "./english-errors";
import { TableBuilder } from "./TableBuilder";

export class StringPresenter implements Presenter{

    public createReplyFromError(error: ErrorCode): StringResolvable | APIMessage {
        if(errors[ErrorCode[error]])
            return `ERROR: ${errors[ErrorCode[error]]}`;
        else
            return `ERROR: An unexpected error occurred with code ${ErrorCode[error]}.`;
    }

    public createReplyFromTeams(teams: [Account[], Account[]]): StringResolvable | APIMessage {
        const table = new TableBuilder();
        table.addHeader(["Team 1", "Team 2"]);
        const playerCount: number = this.getBiggerTeamPlayerCount(teams);
        for(let i=0; i < playerCount; i++){
            const firstSummonerName: string = teams[0][i] ? teams[0][i].summoner.name : "";
            const secondSummonerName: string = teams[1][i] ? teams[1][i].summoner.name : "";
            table.addData([firstSummonerName, secondSummonerName]);
        }
        return table.addLineSeparator().build();
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

    private getBiggerTeamPlayerCount(teams: [Account[], Account[]]){
        return teams[0].length > teams[1].length ?
            teams[0].length :
            teams[1].length;
    }
}