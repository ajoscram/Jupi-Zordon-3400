import { Header } from "./http";

export function createRiotTokenHeader(): Header {
    return {
        name: "X-Riot-Token",
        value: process.env.RIOT_API_KEY || "missing riot api key"
    };
}