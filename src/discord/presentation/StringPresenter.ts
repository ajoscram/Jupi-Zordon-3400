import { StringResolvable, APIMessage } from "discord.js";
import { CalculatedOverallStats, ErrorCode } from "../../core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch, Summoner, Champion } from "../../core/model";
import { Presenter } from ".";
import { errors } from "./english-errors";
import { TableBuilder, Padding } from "./TableBuilder";

export class StringPresenter implements Presenter{

    public createReplyFromError(error: ErrorCode): StringResolvable | APIMessage {
        if(errors[ErrorCode[error]])
            return `ERROR: ${errors[ErrorCode[error]]}`;
        else
            return `ERROR: An unexpected error occurred with code ${ErrorCode[error]}.`;
    }

    public createReplyFromTeams(teams: [Account[], Account[]]): StringResolvable | APIMessage {
        const playerCount: number = this.getLargestPlayerCount(teams[0].length, teams[0].length);
        const tableBuilder: TableBuilder = new TableBuilder();
        tableBuilder.addData(["Team 1", "Team 2"], Padding.LINE);
        for(let i=0; i < playerCount; i++){
            const firstSummonerName: string = teams[0][i]?.summoner.name;
            const secondSummonerName: string = teams[1][i]?.summoner.name;
            tableBuilder.addData([firstSummonerName, secondSummonerName]);
        }
        return tableBuilder
            .addSeparator()
            .build();
    }

    public createReplyFromSummonerStats(overallStats: SummonerOverallStats): StringResolvable | APIMessage {
        const stats: CalculatedOverallStats = new CalculatedOverallStats(overallStats);
        return stats;
    }

    public createReplyFromPrediction(prediction: Prediction): StringResolvable | APIMessage {
        const playerCount: number = this.getLargestPlayerCount(prediction.match.blue.size, prediction.match.red.size);
        const redPlayers: Summoner[] = Array.from(prediction.match.red.keys());
        const bluePlayers: Summoner[] = Array.from(prediction.match.blue.keys());
        const tableBuilder: TableBuilder = new TableBuilder();
        tableBuilder.addData(["Blue Team", "Red Team"], Padding.LINE);
        for(let i=0; i < playerCount; i++){
            tableBuilder.addData([
                this.getOngoingMatchPlayerEntry(prediction.match.blue, bluePlayers[i]),
                this.getOngoingMatchPlayerEntry(prediction.match.red, redPlayers[i])
            ]);
        }
        return tableBuilder
            .addData(["Win %", "Win %"], Padding.LINE)
            .addData([
                ""+(prediction.probabilityBlueWins*100).toFixed(2),
                ""+(prediction.probabilityRedWins*100).toFixed(2)
            ])
            .addSeparator()
            .build();
    }

    public createReplyFromCompletedMatch(match: CompletedMatch): StringResolvable | APIMessage {
        throw new Error("Method not implemented.");
    }

    public createReplyFromAccount(account: Account): StringResolvable | APIMessage {
        return `Linked Discord account **${account.user.name}** with LoL account **${account.summoner.name}**.`;
    }

    public createReplyFromHelp(): StringResolvable | APIMessage {
        return "Visit this link for the list of available commands: https://github.com/ajoscram/Jupi-Zordon-3400/wiki/Commands";
    }

    private getLargestPlayerCount(firstTeamSize: number, secondTeamSize: number): number{
        return firstTeamSize > secondTeamSize ? firstTeamSize : secondTeamSize;
    }

    private getOngoingMatchPlayerEntry(teamMap: Map<Summoner, Champion>, summoner?: Summoner): string{
        return summoner ? summoner.name + " (" + teamMap.get(summoner)?.name + ")" : "";
    }
}