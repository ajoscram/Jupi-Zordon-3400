export const enum Url{
    VERSION = "https://ddragon.leagueoflegends.com/api/versions.json",
    CHAMPIONS = `https://ddragon.leagueoflegends.com/cdn/[VERSION]/data/en_US/champion.json`,
    SUMMONER = "https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/",
    ONGOING_MATCH = "https://la1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/",
    COMPLETED_MATCH = "https://la1.api.riotgames.com/lol/match/v4/matches/",
}