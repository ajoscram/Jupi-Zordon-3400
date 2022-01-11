import { Header } from "./http";

export abstract class RiotBaseFetcher{
    protected createRiotTokenHeader(): Header {
        return {
            name: "X-Riot-Token",
            value: process.env.RIOT_API_KEY ?? "missing riot api key"
        };
    }
}