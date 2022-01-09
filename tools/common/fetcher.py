import requests
from common import dotenv

versions_url = "https://ddragon.leagueoflegends.com/api/versions.json"
champions_url = "https://ddragon.leagueoflegends.com/cdn/{}/data/en_US/champion.json"
summoner_url = "https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
match_url = "https://la1.api.riotgames.com/lol/match/v4/matches/"
match_history_url = "https://la1.api.riotgames.com/lol/match/v4/matchlists/by-account/"

current_summoner_names = {
    "Cannábi Nutria": "McLOVIN Fogell",
    "Divella96": "KeresMight",
    "arcadianforce": "Leo UWU",
    "Greety": "VØ Blueberry",
    "Manuxx11": "NovałManux",
    "EI Pescador": "El Pescatore",
    "Don Melcôchón": "Furciø",
    "Barrita Numar": "El Nieto",
    "NovalManux": "NovałManux",
    "Nï¿½xian": "Nøxian",
    "Don Melcï¿½chï¿½n": "Furciø"
}

def create_champion_dictionary():
    version = requests.get(versions_url).json()[0]
    raw_champions = requests.get(champions_url.format(version)).json()
    champions = {}
    for raw_champion in raw_champions["data"].values():
        champions[raw_champion["key"]] = raw_champion
    return champions

champions = create_champion_dictionary()
token = dotenv.vars()["RIOT_API_KEY"]
summoners = {}

def get_champion(id):
    global champions
    return {
        "id": id,
        "name": champions[id]["name"],
        "picture": champions[id]["image"]["full"]
    }

def get_summoner(name):
    if name in current_summoner_names:
        name = current_summoner_names[name]

    if name not in summoners:
        try:
            safe_name = requests.utils.quote(name)
            response = perform_riot_api_request(summoner_url + safe_name)
            summoners[name] = { "id": response["accountId"], "name": name }
        except KeyError:
            raise KeyError("Summoner name not found: " + name)
    return summoners[name]

def get_match(id):
    match = perform_riot_api_request(match_url + id)
    if "participantIdentities" in match:
        for participant in match["participantIdentities"]:
            participant_name = participant["player"]["summonerName"]
            if participant_name not in summoners:
                participant_id = participant["player"]["accountId"]
                summoners[participant_name] = { "id": participant_id, "name": participant_name }
    return match

def get_match_history(account_id):
    params = { "queue": 420, "endIndex": 10, "beginIndex": 0 }
    url = match_history_url + account_id
    return perform_riot_api_request(url, params)["matches"]

def perform_riot_api_request(url, params={}):
    global token
    header = { "X-Riot-Token": token }
    return requests.get(url, headers=header, params=params).json()