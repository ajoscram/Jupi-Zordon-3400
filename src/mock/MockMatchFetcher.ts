import { MatchFetcher } from "src/core/abstractions";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch, Champion, TeamStats, PerformanceStats } from "src/core/model";

export class MockMatchFetcher implements MatchFetcher {

    private num: number = 0;
    

    public async getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch> {
        const blue: Map<Summoner,Champion> = this.getTeam(summoner);
        const red:  Map<Summoner,Champion> = this.getTeam();
        return {
                    red,
                    blue,
                    serverIdentity,
                    id: "" + this.num++
                }

    }

    public async getCompletedMatch(ongoingMatch: OngoingMatch): Promise<CompletedMatch> {
        return {
                id: ongoingMatch.id,
                serverIdentity: ongoingMatch.serverIdentity,
                blue : this.getTeamStats(ongoingMatch.blue, true),
                red : this.getTeamStats(ongoingMatch.red, false),
                minutesPlayed : 31,
                date : new Date()
            };
    }

    private getTeamStats(mapSummChamp: Map<Summoner,Champion>, wonTeam: boolean): TeamStats{
        
        return {
            bans: [],
            won: wonTeam,
            dragons: 3,
            heralds: 1,
            barons: 1,
            towers: 9,
            performanceStats: this.getPerformanceStatsArray(mapSummChamp, wonTeam)
        }
    }

    private getPerformanceStatsArray(mapSummChamp: Map<Summoner,Champion>, wonTeam: boolean ): PerformanceStats[] {
        const performanceStatsJson: PerformanceStats[] = [];
        let first: boolean = true;
        for (let summoner of mapSummChamp.keys()){
            const champion: Champion|undefined = mapSummChamp.get(summoner)
            performanceStatsJson.push(
                this.getPerformanceStats(
                    summoner, 
                    champion?champion: this.createChampion(69),
                    first && wonTeam,
                    first && wonTeam
                )
            );
            first = false;
        }
        return performanceStatsJson;
    }

    private getPerformanceStats(summoner: Summoner, champion: Champion, firstBlood: boolean, firstTower: boolean): PerformanceStats {
        return {
            summoner,
            champion,
            largestMultikill: 4,
            largestKillingSpree: 3,
            firstBlood,
            firstTower,
            role: "MIDDLE",
            assists: 2,
            deaths: 20,
            damageDealtToChampions: 53405,
            damageDealtToObjectives: 2345,
            damageReceived: 78798,
            gold: 11350,
            kills: 10,
            minions: 125,
            minutesPlayed: 31,
            visionScore: 21,
            crowdControlScore: 15
        }
    }

    private createChampion(id:number): Champion{
        return {
                    picture : "https://www.poppy.com",
                    id: id.toString(),
                    name: "Summoner " + id
                };
    }

        
    private getTeam(summoner?: Summoner): Map<Summoner,Champion> {

        let teamPlayers: number;
        const team: Map<Summoner,Champion> = new Map();

        if (summoner){
            teamPlayers = 4;
            team.set(summoner, this.createChampion(this.num++));
            }
        else
            teamPlayers = 5;

        
        
        for (let i = 0; i<teamPlayers; i++) {
            const summ: Summoner = {
                                        id: this.num.toString(),
                                        name: "Summoner" + this.num++
                                    };

            const champ: Champion = this.createChampion(this.num++);
            team.set(summ,champ);
            
        }
        return team;

    }

        
}