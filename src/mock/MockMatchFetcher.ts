import { MatchFetcher } from "../core/abstractions";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch, Champion, TeamStats, PerformanceStats, Role, Participant } from "../core/model";

export class MockMatchFetcher implements MatchFetcher {

    private num: number = 0;
    
    public async getOngoingMatch(summoner: Summoner, serverIdentity: ServerIdentity): Promise<OngoingMatch> {
        const blue: Participant[] = this.getParticipants(summoner);
        const red:  Participant[] = this.getParticipants();
        return {
            blue,        
            red,        
            serverIdentity,
            id: "" + this.num++,
            date: new Date()
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

    private getTeamStats(participants: Participant[], wonTeam: boolean): TeamStats{ 
        return {
            bans: [],
            won: wonTeam,
            dragons: 3,
            heralds: 1,
            barons: 1,
            towers: 9,
            performanceStats: this.getPerformanceStatsArray(participants, wonTeam)
        };
    }

    private getPerformanceStatsArray(participants: Participant[], wonTeam: boolean ): PerformanceStats[] {
        const performanceStatsArray: PerformanceStats[] = [];
        const roles: Role[] = [ Role.TOP, Role.MIDDLE, Role.JUNGLE, Role.CARRY, Role.SUPPORT ];
        for (let participant of participants){
            performanceStatsArray.push(
                this.getPerformanceStats(
                    participant.summoner, 
                    participant.champion,
                    roles.pop() ?? Role.UNKNOWN
                )
            );
        }
        return performanceStatsArray;
    }

    private getPerformanceStats(summoner: Summoner, champion: Champion, role: Role): PerformanceStats {
        return {
            summoner,
            champion,
            largestMultikill: 5,
            largestKillingSpree: 6,
            role,
            assists: 2,
            deaths: 20,
            damageDealtToChampions: 53405,
            damageDealtToObjectives: 2345,
            damageReceived: 78798,
            gold: 11350,
            kills: 10,
            minions: 125,
            visionScore: 21,
            crowdControlScore: 15,
            pentakills: 1
        };
    }

    private createChampion(id: number): Champion{
        return {
            picture : "https://www.poppy.com",
            id: id.toString(),
            name: "Champion " + id
        };
    }

        
    private getParticipants(summoner?: Summoner): Participant[] {

        let teamPlayers: number;
        const participants: Participant[] = [];

        if (summoner){
            teamPlayers = 4;
            participants.push({
                summoner,
                champion: this.createChampion(this.num++)
            });
        }
        else
            teamPlayers = 5;

        for (let i = 0; i < teamPlayers; i++) {
            const summoner: Summoner = {
                id: this.num.toString(),
                name: "Summoner " + this.num++
            };
            const champion: Champion = this.createChampion(this.num++);
            participants.push({summoner,champion});
        }
        return participants;
    }   
}