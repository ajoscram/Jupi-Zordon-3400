import { StringResolvable, APIMessage } from "discord.js";
import { ErrorCode } from "../../core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch, OngoingMatch, Summoner, Champion } from "../../core/model";
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
        const tableBuilder: TableBuilder = new TableBuilder();
        tableBuilder.addHeader(["Team 1", "Team 2"]);
        const playerCount: number = this.getPlayerCountFromTeams(teams);
        for(let i=0; i < playerCount; i++){
            const firstSummonerName: string = teams[0][i] ? teams[0][i].summoner.name : "";
            const secondSummonerName: string = teams[1][i] ? teams[1][i].summoner.name : "";
            tableBuilder.addData([firstSummonerName, secondSummonerName]);
        }
        return tableBuilder
            .addLineSeparator()
            .build();
    }

    public createReplyFromSummonerStats(stats: SummonerOverallStats): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromPrediction(prediction: Prediction): StringResolvable | APIMessage {
        const tableBuilder: TableBuilder = new TableBuilder();
        const playerCount: number = this.getPlayerCountFromOngoingMatch(prediction.match);
        const redPlayers: Summoner[] = Array.from(prediction.match.red.keys());
        const bluePlayers: Summoner[] = Array.from(prediction.match.blue.keys());
        
        tableBuilder.addHeader(["Blue Team", "Red Team"]);
        for(let i=0; i < playerCount; i++){
            const blueEntry: string = this.getOngoingMatchPlayerEntry(prediction.match.blue, bluePlayers[i]);
            const redEntry: string = this.getOngoingMatchPlayerEntry(prediction.match.red, redPlayers[i]);
            tableBuilder.addData([blueEntry, redEntry]);
        }
        return tableBuilder
            .addHeader(["Win %", "Win %"])
            .addData([
                ""+(prediction.probabilityBlueWins*100).toFixed(2),
                ""+(prediction.probabilityRedWins*100).toFixed(2)
            ])
            .addLineSeparator()
            .build();
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

    private getPlayerCountFromTeams(teams: [Account[], Account[]]): number{
        return teams[0].length > teams[1].length ?
            teams[0].length :
            teams[1].length;
    }

    private getPlayerCountFromOngoingMatch(match: OngoingMatch): number{
        return match.blue.size > match.red.size ?
            match.blue.size :
            match.red.size;
    }

    private getOngoingMatchPlayerEntry(teamMap: Map<Summoner, Champion>, summoner?: Summoner): string{
        return summoner ?
            summoner.name + " (" + teamMap.get(summoner)?.name + ")" :
            "";
    }
}