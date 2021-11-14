import { Champion } from "../../core/model";
import { ChampionFetcher } from ".";
import { Header, HttpClient } from "../http";
import { BotError, ErrorCode } from "../../core/concretions";
import { createRiotTokenHeader } from "../utils";
import { RawChampion, RawChampionContainer } from "../model";

export class DataDragonChampionFetcher implements ChampionFetcher{
    
    private static readonly VERSION_WILDCARD = "[VERSION]";
    private static readonly VERSION_URL: string = "https://ddragon.leagueoflegends.com/api/versions.json";
    private static readonly CHAMPIONS_URL: string = `https://ddragon.leagueoflegends.com/cdn/${DataDragonChampionFetcher.VERSION_WILDCARD}/data/en_US/champion.json`;

    private idToChampionsMap: Map<number, Champion>;

    constructor(
        private readonly client: HttpClient
    ){}

    public async getChampion(championId: number): Promise<Champion> {
        await this.fetchChampionMapIfNeeded();
        const champion: Champion | undefined = this.idToChampionsMap.get(championId);
        if(champion)
            return champion;
        else{
            const innerError: Error = new Error(`Champion lookup failed for ID: ${championId}`);
            throw new BotError(ErrorCode.UNKNOWN_CHAMPION_ID, innerError);
        }
    }

    private async fetchChampionMapIfNeeded(): Promise<void> {
        if(!this.idToChampionsMap){
            const url: string = await this.getChampionsUrl();
            const header: Header = createRiotTokenHeader();
            const container: RawChampionContainer = await this.client.get(url, [ header ]) as RawChampionContainer;
            this.idToChampionsMap = this.getIdToChampionsMap(container.data);
        }
    }

    private async getChampionsUrl(): Promise<string> {
        const version: string = await this.getLatestVersion();
        return DataDragonChampionFetcher.CHAMPIONS_URL.replace(
            DataDragonChampionFetcher.VERSION_WILDCARD,
            version
        );
    }

    private async getLatestVersion(): Promise<string> {
        const header: Header = createRiotTokenHeader();
        const versions: string[] = await this.client.get(DataDragonChampionFetcher.VERSION_URL, [ header ]) as string[];
        return versions[0];
    }

    private getIdToChampionsMap(champions: { [championNameId: string]: RawChampion }): Map<number, Champion>{
        const map: Map<number, Champion> = new Map();
        for(const nameId in champions){
            const rawChampion: RawChampion = champions[nameId];
            const champion: Champion = {
                id: rawChampion.key,
                name: rawChampion.name,
                picture: rawChampion.image.full
            }
            map.set(Number.parseInt(champion.id), champion);
        }
        return map;
    }
}