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

    public get matches(): number {
        return this.stats.losses + this.stats.wins;
    }

    public get winrate(): number {
        return this.calculateValuePerMatch(this.stats.wins);
    }

    public get assists(): number {
        return this.stats.assists;
    }

    public get assistsPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.assists);
    }

    public get deaths(): number {
        return this.stats.deaths;
    }

    public get deathsPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.deaths);
    }

    public get kills(): number {
        return this.stats.kills;
    }

    public get killsPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.kills);
    }

    public get kda(): number {
        return this.divideSafely(
            this.stats.kills + this.stats.assists,
            this.stats.deaths
        );
    }

    public get damageDealtToChampions(): number {
        return this.stats.damageDealtToChampions;
    }

    public get damageDealtToChampionsPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.damageDealtToChampions);
    }

    public get damageDealtToObjectives(): number {
        return this.stats.damageDealtToObjectives;
    }

    public get damageDealtToObjectivesPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.damageDealtToObjectives);
    }

    public get damageReceived(): number {
        return this.stats.damageReceived;
    }

    public get damageReceivedPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.damageReceived);
    }

    public get damageRate(): number {
        return this.divideSafely(
            this.stats.damageDealtToChampions,
            this.stats.damageReceived
        );
    }

    public get gold(): number {
        return this.stats.gold;
    }

    public get goldPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.gold);
    }

    public get goldPerMinute(): number{
        return this.calculateValuePerMinute(this.stats.gold);
    }

    public get minions(): number {
        return this.stats.minions;
    }

    public get minionsPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.minions);
    }

    public get minionsPerMinute(): number {
        return this.calculateValuePerMinute(this.stats.minions);
    }

    public get minutesPlayed(): number {
        return this.stats.minutesPlayed;
    }

    public get minutesPlayedPerMatch(): number {
        return this.calculateValuePerMatch(this.stats.minutesPlayed);
    }

    public get visionScore(): number {
        return this.stats.visionScore;
    }

    public get visionScorePerMatch(): number {
        return this.calculateValuePerMatch(this.stats.visionScore);
    }

    public get crowdControlScore(): number {
        return this.stats.crowdControlScore;
    }

    public get crowdControlScorePerMatch(): number {
        return this.calculateValuePerMatch(this.stats.crowdControlScore);
    }

    public get pentakills(): number{
        return this.stats.pentakills;
    }

    private calculateValuePerMatch(value: number): number {
        return this.divideSafely(value, this.matches);
    }

    private calculateValuePerMinute(value: number): number {
        return this.divideSafely(value, this.minutesPlayed);
    }

    private divideSafely(numerator: number, denominator: number): number{
        return denominator !== 0 ? numerator / denominator : numerator;
    }
}