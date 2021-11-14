import { Champion } from "../../core/model";

export interface ChampionFetcher{
    getChampion(championId: number): Promise<Champion>
}