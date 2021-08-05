import { MatchFetcher } from "../core/abstractions";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch, Champion, TeamStats, PerformanceStats, Role } from "../core/model";

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
                };
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
        };
    }

    private getPerformanceStatsArray(mapSummChamp: Map<Summoner,Champion>, wonTeam: boolean ): PerformanceStats[] {
        const performanceStatsArray: PerformanceStats[] = [];
        const roles: Role[] = [ Role.TOP, Role.MIDDLE, Role.JUNGLE, Role.CARRY, Role.SUPPORT ];
        let first: boolean = true;
        for (let summoner of mapSummChamp.keys()){
            performanceStatsArray.push(
                this.getPerformanceStats(
                    summoner, 
                    mapSummChamp.get(summoner) ?? this.createChampion(this.num++),
                    first && wonTeam,
                    first && wonTeam,
                    roles.pop() ?? Role.UNKNOWN
                )
            );
            first = false;
        }
        return performanceStatsArray;
    }

    private getPerformanceStats(summoner: Summoner, champion: Champion, firstBlood: boolean, firstTower: boolean, role: Role): PerformanceStats {
        return {
            summoner,
            champion,
            largestMultikill: 4,
            largestKillingSpree: 3,
            firstBlood,
            firstTower,
            role,
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
        };
    }

    private createChampion(id: number): Champion{
        return {
                    picture : "https://www.poppy.com",
                    id: id.toString(),
                    name: "Champion " + id
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
                                        name: "Summoner " + this.num++
                                    };

            const champ: Champion = this.createChampion(this.num++);
            team.set(summ,champ);
            
        }
        return team;
    }   
}