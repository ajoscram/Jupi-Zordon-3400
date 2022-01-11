import { Champion } from "../../core/model";
import { ChampionFetcher } from ".";
import { HttpClient } from "../http";
import { BotError, ErrorCode } from "../../core/concretions";
import { RawChampion, RawChampionContainer } from "../model";
import { Url } from "../Url";

export class DataDragonChampionFetcher implements ChampionFetcher{
    
    private static readonly VERSION_WILDCARD = "[VERSION]";

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
            const container: RawChampionContainer = await this.client.get(url, []) as RawChampionContainer;
            this.idToChampionsMap = this.getIdToChampionsMap(container.data);
        }
    }

    private async getChampionsUrl(): Promise<string> {
        const version: string = await this.getLatestVersion();
        return Url.CHAMPIONS.replace(
            DataDragonChampionFetcher.VERSION_WILDCARD,
            version
        );
    }

    private async getLatestVersion(): Promise<string> {
        const versions: string[] = await this.client.get(Url.VERSION, [ ]) as string[];
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