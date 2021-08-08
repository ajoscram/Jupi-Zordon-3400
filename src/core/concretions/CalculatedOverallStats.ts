import { OverallStats } from "../model";

export class CalculatedOverallStats implements OverallStats{
    private stats: OverallStats;

    constructor(overallStats: OverallStats){
        this.stats = overallStats;
    }
    
    public get wins() : number {
        return this.stats.wins;
    }

    public get losses(): number {
        return this.stats.losses;
    }

    public get matches(): number{
        return this.stats.losses + this.stats.wins;
    }

    public get winrate(): number {
        return this.stats.wins / this.matches;
    }

    public get assists(): number {
        return this.stats.assists;
    }

    public get assistsPerGame(): number {
        return this.stats.assists / this.matches;
    }

    public get deaths(): number {
        return this.stats.deaths;
    }

    public get deathsPerGame(): number {
        return this.stats.deaths / this.matches;
    }

    public get kills(): number {
        return this.stats.kills;
    }

    public get killsPerGame(): number {
        return this.stats.assists / this.matches;
    }

    public get kda(): number {
        return (this.stats.kills + this.stats.assists) / this.stats.deaths;
    }

    public get damageDealtToChampions(): number {
        return this.stats.damageDealtToChampions;
    }

    public get damageDealtToChampionsPerGame(): number {
        return this.stats.damageDealtToChampions / this.matches;
    }

    public get damageDealtToObjectives(): number {
        return this.stats.damageDealtToObjectives;
    }

    public get damageDealtToObjectivesPerGame(): number {
        return this.stats.damageDealtToObjectives / this.matches;
    }

    public get damageReceived(): number {
        return this.stats.damageReceived;
    }

    public get damageReceivedPerGame(): number {
        return this.stats.damageReceived / this.matches;
    }

    public get gold(): number {
        return this.stats.gold;
    }

    public get goldPerGame(): number {
        return this.stats.gold / this.matches;
    }

    public get minions(): number {
        return this.stats.minions;
    }

    public get minionsPerGame(): number {
        return this.stats.minions / this.matches;
    }
    
    public get minutesPlayed(): number {
        return this.stats.minutesPlayed;
    }

    public get minutesPlayedPerGame(): number {
        return this.stats.minutesPlayed / this.matches;
    }

    public get visionScore(): number {
        return this.stats.visionScore;
    }

    public get visionScorePerGame(): number {
        return this.stats.visionScore / this.matches;
    }

    public get crowdControlScore(): number {
        return this.stats.crowdControlScore;
    }

    public get crowdControlScorePerGame(): number {
        return this.stats.crowdControlScore / this.matches;
    }
}