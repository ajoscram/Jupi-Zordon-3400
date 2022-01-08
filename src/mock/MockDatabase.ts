import { Database } from "../core/abstractions";
import { User, Account, Summoner, SummonerOverallStats, AIModel, OngoingMatch, CompletedMatch, Pick, ServerIdentity } from "../core/model";

export class MockDatabase implements Database {

    private id: number = 0;

    public readonly ongoingMatches: OngoingMatch[] = [];
    public readonly completedMatches: CompletedMatch[] = [];
    public readonly accounts: Account[] = [];

    public async initialize(): Promise<void> { }

    public async getAccount(user: User): Promise<Account> {
        return {
            summoner: {
                id: "" + this.id++,
                name: "summoner_name"
            },
            user
        };
    }

    public async getAccounts(users: User[]): Promise<Account[]> {
        const accounts: Account[] = [];

        for (let element of users) {
            const account: Account = await this.getAccount(element);
            accounts.push(account);
        }

        return accounts;
    }

    public async getSummonerOverallStats(summoner: Summoner): Promise<SummonerOverallStats> {
        const picks: Pick[] = [];
        picks.push(this.getPick("17", "Katarina", 17));
        picks.push(this.getPick("18", "Illaoi", 30));
        picks.push(this.getPick("19", "Yuumi", 1));
        picks.push(this.getPick("20", "Ezreal", 13));
        picks.push(this.getPick("21", "Cho'Gath", 24));
        return {
            summoner,
            picks: picks,
            wins: 17,
            losses: 10,
            assists: 180,
            deaths: 200,
            damageDealtToChampions: 850000,
            damageDealtToObjectives: 700000,
            damageReceived: 1050000,
            gold: 200123,
            kills: 300,
            minions: 2000,
            minutesPlayed: 425,
            visionScore: 100,
            crowdControlScore: 200,
            pentakills: 3
        };
    }

    private getPick(championId: string, championName: string, count: number): Pick{
        return {
            champion: {
                id: championId,
                name: championName,
                picture: championName + ".png"
            },
            count
        }
    }

    public async getAIModel(): Promise<AIModel> {
        return {};
    }

    public async getOngoingMatches(serverIdentity: ServerIdentity): Promise<OngoingMatch[]> {
        return [...this.ongoingMatches];
    }

    public async getOngoingMatch(serverIdentity: ServerIdentity, index: number): Promise<OngoingMatch> {
        return this.ongoingMatches[index];
    }

    public async upsertAccount(account: Account): Promise<void> {
        //Check if account is created to update it or add it
        const desiredAccount: Account|undefined = this.accounts.find(element => 
            element.summoner.id === account.summoner.id &&
            element.user.id === account.user.id);

        if (desiredAccount) {
            //update
            const index = this.accounts.indexOf(desiredAccount);
            this.accounts[index] = account;
        } else {
            //insert
            this.accounts.push(account);
        }

    }

    public async insertOngoingMatch(ongoingMatch: OngoingMatch): Promise<void> {
        this.ongoingMatches.push(ongoingMatch);
    }

    public async insertCompletedMatches(completedMatches: CompletedMatch[]): Promise<void> {
        this.completedMatches.push(...completedMatches);
    }

    public  async deleteOngoingMatches(matches: OngoingMatch[]): Promise<void> {
        matches.forEach(x => this.deleteOngoingMatch(x));
    }

    private async deleteOngoingMatch(match: OngoingMatch): Promise<void> {
        const index: number = this.ongoingMatches.indexOf(match);
        if(index != -1)
            this.ongoingMatches.splice(index, 1);
    }
}