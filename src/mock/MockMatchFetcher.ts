import { MatchFetcher } from "src/core/abstractions";
import { Summoner, ServerIdentity, OngoingMatch, CompletedMatch, Champion } from "src/core/model";

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
        throw new Error("Not implemente");
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