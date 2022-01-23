import requests, urllib3
from requests.auth import HTTPBasicAuth

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

__CURRENT_SUMMONER_MATCHES_URL__ = "https://127.0.0.1:{}/lol-match-history/v1/products/lol/current-summoner/matches"
__GAME_BY_ID_URL__ = "https://127.0.0.1:{}/lol-match-history/v1/games/{}"

__port__ = None
__auth__ = None

def initialize(port, password):
    global __port__, __auth__
    __port__ = port
    __auth__ = HTTPBasicAuth("riot", password)

def get_matches(only_customs):
    match_ids = __get_match_ids__(only_customs)
    return [ __get_match__(id) for id in match_ids ]

def __get_match_ids__(only_customs):
    url = __CURRENT_SUMMONER_MATCHES_URL__.format(__port__)
    response = __request__(url)
    return [
        match["gameId"]
        for match in response["games"]["games"]
        if not only_customs or __match_is_legal_custom_game__(match)
    ]

def __match_is_legal_custom_game__(match):
    return match["gameType"] == "CUSTOM_GAME" and match["gameMode"] != "PRACTICETOOL"

def __get_match__(id):
    url = __GAME_BY_ID_URL__.format(__port__, id)
    return __request__(url)

def __request__(url):
    return requests.get(url, verify=False, auth=__auth__).json()
