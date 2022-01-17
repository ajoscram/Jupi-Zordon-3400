import { StringResolvable, APIMessage } from "discord.js";
import { CalculatedOverallStats, ErrorCode } from "../../core/concretions";
import { Account, SummonerOverallStats, Prediction, CompletedMatch, TeamStats, PerformanceStats, Pick, Participant, OngoingMatch } from "../../core/model";
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
        const tableBuilder: TableBuilder = new TableBuilder()
            .addSeparator()
            .addHeader("Balanced Teams", Padding.EMPTY)
            .addData(["Team 1", "Team 2"], Padding.LINE);
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

    public createReplyFromRecordedMatch(match: OngoingMatch, prediction: Prediction): StringResolvable | APIMessage {
        const builder: TableBuilder = new TableBuilder()
            .addSeparator()
            .addHeader("New Match Recorded", Padding.EMPTY);
        this.addOngoingMatchToBuilder(builder, match, prediction);
        return builder.build();
    }

    public createReplyFromRecordedMatches(matches: OngoingMatch[]): StringResolvable | APIMessage {
        if(matches.length == 0)
            return "No recorded matches to display.";
        
        const builder: TableBuilder = new TableBuilder()
            .addSeparator(Padding.LINE)
            .addHeader("Recorded Matches", Padding.EMPTY);
        this.addSummarizedOngoingMatchesToBuilder(builder, matches, true);
        return builder.build();
    }

    public createReplyFromKeptMatches(matches: CompletedMatch[]): StringResolvable | APIMessage {
        let builder: TableBuilder;
        switch(matches.length){
            case 0:
                return "There were no recorded matches to keep.";
            case 1:
                builder = new TableBuilder()
                    .addSeparator(Padding.LINE)
                    .addHeader("New Match Kept", Padding.EMPTY);
                this.addCompletedMatchToBuilder(builder, matches[0]);
                break;
            default:
                builder = new TableBuilder()
                    .addSeparator(Padding.LINE)
                    .addHeader("New Matches Kept", Padding.EMPTY);
                this.addSummarizedCompletedMatchesToBuilder(builder, matches);
                break;
        }
        return builder.build();
    }

    public createReplyFromDiscardedMatches(matches: OngoingMatch[]): StringResolvable | APIMessage {
        let builder: TableBuilder;
        switch(matches.length){
            case 0:
                return "There were no recorded matches to discard.";
            case 1:
                builder = new TableBuilder()
                    .addSeparator(Padding.LINE)
                    .addHeader("New Match Discarded", Padding.EMPTY);
                this.addOngoingMatchToBuilder(builder, matches[0]);
                break;
            default:
                builder = new TableBuilder()
                    .addSeparator(Padding.LINE)
                    .addHeader("New Matches Discarded", Padding.EMPTY);
                this.addSummarizedOngoingMatchesToBuilder(builder, matches, false);
                break;
        }
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

    private stringify(value: number){
        let suffix: string = "";
        if(Math.abs(value) > 1000){
            value = value / 1000;
            suffix = "k";
        }

        return value % 1 == 0 ?
            value + suffix :
            value.toFixed(2) + suffix;
    }

    private addCompletedMatchToBuilder(builder: TableBuilder, match: CompletedMatch): void {
        builder
            .addHeader(match.date.toDateString()+" - " + match.minutesPlayed + " minutes")
            .addSeparator(Padding.EMPTY);
        this.addTeamStatsToBuilder(builder, "Red", match.red, match.minutesPlayed);
        builder.addSeparator(Padding.EMPTY);
        this.addTeamStatsToBuilder(builder, "Blue", match.blue, match.minutesPlayed);
    }

    private addTeamStatsToBuilder(builder: TableBuilder, teamName: string, stats: TeamStats, minutesPlayed: number): void {
        builder.addHeader(teamName + " - " + (stats.won ? "WON" : "LOST"), Padding.EMPTY);
        this.addPerformanceStatsToBuilder(builder, stats.performanceStats, minutesPlayed);
        builder.addSeparator().addHeader(
            "Dragons: " + stats.dragons +
            " Heralds: " + stats.heralds + 
            " Towers: " + stats.towers + 
            " Barons: " + stats.barons, 
            Padding.EMPTY
        );
        builder.addSeparator();
    }

    private addPerformanceStatsToBuilder(builder: TableBuilder, performanceStats: PerformanceStats[], minutesPlayed: number): void {
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
                this.stringify(performance.minions / minutesPlayed)
            ]);
        }
    }

    private addSummarizedCompletedMatchesToBuilder(builder: TableBuilder, matches: CompletedMatch[]): void {
        builder.addData(["Date & Duration", "Teams", "Picks"], Padding.LINE);
        for(const match of matches){
            builder
                .addData([
                    match.date.toDateString(),
                    "Blue" + (match.blue.won ? " (W)" : ""),
                    match.blue.performanceStats.map(x => x.champion.name).join(", "),
                ])
                .addData([
                    match.minutesPlayed.toString() + " mins",
                    "Red" + (match.red.won ? " (W)" : ""),
                    match.red.performanceStats.map(x => x.champion.name).join(", "),
                ])
                .addSeparator();
        }
    }

    private addOngoingMatchToBuilder(builder: TableBuilder, match: OngoingMatch, prediction?: Prediction): void {
        builder.addHeader(match.date.toDateString(), Padding.LINE)
        this.addOngoingMatchTeamToBuilder(builder, "Red", match.red, prediction?.probabilityRedWins);
        this.addOngoingMatchTeamToBuilder(builder, "Blue", match.blue, prediction?.probabilityRedWins);
    }

    private addOngoingMatchTeamToBuilder(builder: TableBuilder, teamName: string, participants: Participant[], probabilityToWin?: number){
        builder
            .addSeparator(Padding.EMPTY)
            .addHeader(teamName, Padding.EMPTY);
        this.addParticipantsToBuilder(builder, participants);
        
        if(probabilityToWin !== undefined){
            builder
                .addHeader(`${this.stringify(probabilityToWin)}% chance to win`, Padding.EMPTY)
                .addSeparator();
        }
    }

    private addParticipantsToBuilder(builder: TableBuilder, participants: Participant[]): void{
        builder.addData(["Summoner", "Champion"], Padding.LINE);
        for(const participant of participants)
            builder.addData([participant.summoner.name, participant.champion.name]);
        builder.addSeparator();
    }

    private addSummarizedOngoingMatchesToBuilder(builder: TableBuilder, matches: OngoingMatch[], includeIndex: boolean): void {
        
        const firstRow: string[] = includeIndex ? ["#", "Teams", "Picks"] : ["Teams", "Picks"];
        builder.addData(firstRow, Padding.LINE);
        
        for(let i = 0; i < matches.length; i++){
            
            const bluePicks: string = matches[i].blue.map(x => x.champion.name).join(", ");
            const blueRow: string[] = includeIndex ? 
                [ i.toString(), "Blue", bluePicks ] : 
                [ "Blue", bluePicks ];
            
            const redPicks: string = matches[i].red.map(x => x.champion.name).join(", ");
            const redRow: string[] = includeIndex ? 
                [ "", "Red", redPicks ] : 
                [ "Red", redPicks ];

            builder.addData(blueRow).addData(redRow).addSeparator();
        }
    }
}