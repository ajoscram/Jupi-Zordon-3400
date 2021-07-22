import { Database } from "src/core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch } from "src/core/model";

export class MockDatabase implements Database {

    private id: number = 0;

    public readonly ongoingMatches: OngoingMatch[] = [];

    public async initialize(): Promise<void> { }

    public async getAccount(user: User): Promise<Account> {
        return {summoner: {
                    id: "" + this.id++,
                    name: "summoner_name"
                },
                user        
        };
    }
   
    public async getAccounts(users: User[]): Promise<Account[]> {
        const accounts: Account[] = [];

        for(let element of users){
            const account: Account = await this.getAccount(element);
            accounts.push(account);
        }

        return accounts;
    }
    
    public async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        throw new Error("Method not implemented.");
    }
   
    public async getAIModel(): Promise<AIModel> {
        return {};
    }
   
    public async upsert(account: Account): Promise<void> {
        //Check if account is created to update it or add it

        throw new Error("Method not implemented.");
    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        this.ongoingMatches.push(ongoingMatch);
    }

    public async insertCompletedMatch(completedMatch: CompletedMatch): Promise<void> {
        throw new Error("Method not implemented.");
    }
}