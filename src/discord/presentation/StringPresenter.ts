import { StringResolvable, APIMessage } from "discord.js";
import { CalculatedOverallStats, ErrorCode } from "../../core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch, TeamStats, PerformanceStats, Pick, Participant } from "../../core/model";
import { Presenter } from ".";
import { errors } from "./english-errors";
import { TableBuilder, Padding } from "./TableBuilder";

export class StringPresenter implements Presenter {

    public createReplyFromError(error: ErrorCode): StringResolvable | APIMessage {
        if(errors[ErrorCode[error]])
            return `ERROR: ${errors[ErrorCode[error]]}`;
        else
            return `${errors.UNKNOWN} (${ErrorCode[error]})"`;
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
        const sortedPicks: Pick[] = overallStats.picks.sort((x, y) => y.count - x.count);
        return new TableBuilder()
            .addHeader(overallStats.summoner.name)
            .addSeparator(Padding.EMPTY)
            .addHeader("General", Padding.EMPTY)
            .addData(["Matches", "Wins", "Losses", "Winrate"], Padding.LINE)
            .addData([
                this.stringify(stats.matches),
                this.stringify(stats.wins),
                this.stringify(stats.losses),
                this.stringify(stats.winrate*100) + " %"
            ])
            .addData(["Kills", "Deaths", "Assists", "KDA"], Padding.LINE)
            .addData([
                this.stringify(stats.killsPerMatch),
                this.stringify(stats.deathsPerMatch),
                this.stringify(stats.assistsPerMatch),
                this.stringify(stats.kda)
            ])
            .addSeparator()
            .addSeparator(Padding.EMPTY)
            .addHeader("Most Played", Padding.EMPTY)
            .addData([
                sortedPicks[0]?.champion.name,
                sortedPicks[1]?.champion.name,
                sortedPicks[2]?.champion.name,
                sortedPicks[3]?.champion.name
            ],Padding.LINE)
            .addData([
                sortedPicks[0] ? this.stringify(sortedPicks[0].count) : "",
                sortedPicks[1] ? this.stringify(sortedPicks[1].count) : "",
                sortedPicks[2] ? this.stringify(sortedPicks[2].count) : "",
                sortedPicks[3] ? this.stringify(sortedPicks[3].count) : ""
            ])
            .addSeparator()
            .addSeparator(Padding.EMPTY)
            .addHeader("Damage", Padding.EMPTY)
            .addData(["Champions", "Objectives", "Received", "Rate"], Padding.LINE)
            .addData([
                this.stringify(stats.damageDealtToChampionsPerMatch),
                this.stringify(stats.damageDealtToObjectivesPerMatch),
                this.stringify(stats.damageReceivedPerMatch),
                this.stringify(stats.damageRate)
            ])
            .addSeparator()
            .addSeparator(Padding.EMPTY)
            .addHeader("Income", Padding.EMPTY)
            .addData(["Gold", "Gold / Min", "CS", "CS / Min"], Padding.LINE)
            .addData([
                this.stringify(stats.goldPerMatch),
                this.stringify(stats.goldPerMinute),
                this.stringify(stats.minionsPerMatch),
                this.stringify(stats.minionsPerMinute),
            ])
            .addSeparator()
            .addSeparator(Padding.EMPTY)
            .addHeader("Others", Padding.EMPTY)
            .addData(["Minutes", "Vision", "CC", "Pentas"], Padding.LINE)
            .addData([
                this.stringify(stats.minutesPlayedPerMatch), 
                this.stringify(stats.visionScorePerMatch),
                this.stringify(stats.crowdControlScorePerMatch),
                this.stringify(overallStats.pentakills)
            ])
            .addSeparator()
            .build();
    }

    public createReplyFromPrediction(prediction: Prediction): StringResolvable | APIMessage {
        const playerCount: number = this.getLargestPlayerCount(prediction.match.blue.length, prediction.match.red.length);
        const tableBuilder: TableBuilder = new TableBuilder();
        tableBuilder.addData(["Blue Team", "Red Team"], Padding.LINE);
        for(let i=0; i < playerCount; i++){
            tableBuilder.addData([
                this.getOngoingMatchPlayerEntry(prediction.match.blue[i]),
                this.getOngoingMatchPlayerEntry(prediction.match.red[i])
            ]);
        }
        return tableBuilder
            .addData(["Win %", "Win %"], Padding.LINE)
            .addData([
                this.stringify(prediction.probabilityBlueWins*100),
                this.stringify(prediction.probabilityRedWins*100)
            ])
            .addSeparator()
            .build();
    }

    public createReplyFromCompletedMatch(match: CompletedMatch): StringResolvable | APIMessage {
        let builder: TableBuilder = new TableBuilder();
        builder
            .addHeader(match.date.toDateString()+" - " + match.minutesPlayed + " minutes")
            .addSeparator(Padding.EMPTY);
        this.addTeamStats(builder, "Red", match.red);
        builder.addSeparator(Padding.EMPTY);
        this.addTeamStats(builder, "Blue", match.blue);
        return builder.build();
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

    private getOngoingMatchPlayerEntry(participant?: Participant): string{
        return participant ? participant.summoner.name + " (" + participant.champion.name + ")" : "";
    }

    private stringify(value: number){
        let suffix: string = "";
        if(value > 1000 || value < -1000){
            value = value / 1000;
            suffix = "k";
        }

        return value % 1 == 0 ?
            value + suffix :
            value.toFixed(2) + suffix;
    }

    private addTeamStats(builder: TableBuilder, teamName: string, stats: TeamStats): TableBuilder{
        builder.addHeader(teamName + " - " + (stats.won ? "WON" : "LOST"), Padding.EMPTY);
        this.addPerformanceStats(builder, stats.performanceStats);
        builder.addSeparator().addHeader(
            "Dragons: " + stats.dragons +
            " Heralds: " + stats.heralds + 
            " Towers: " + stats.towers + 
            " Barons: " + stats.barons, 
            Padding.EMPTY
        );
        return builder.addSeparator();
    }

    private addPerformanceStats(builder: TableBuilder, performanceStats: PerformanceStats[]): TableBuilder{
        builder.addData(
            ["Summoner", "Champion", "KDA", "Damage","CS / Min"],
            Padding.LINE
        );
        for(let performance of performanceStats){
            builder.addData([
                performance.summoner.name,
                performance.champion.name,
                performance.kills + "/" + performance.deaths + "/" + performance.assists,
                this.stringify(performance.damageDealtToChampions),
                this.stringify(performance.minions / performance.minutesPlayed)
            ]);
        }
        return builder;
    }
}