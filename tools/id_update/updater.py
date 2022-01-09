from common import fetcher

def update(match):
    for performance in match["blue"]["performanceStats"]:
        update_summoner(performance)
    for performance in match["red"]["performanceStats"]:
        update_summoner(performance)

def update_summoner(performance):
    summoner_name = performance["summoner"]["name"]
    summoner = fetcher.get_summoner(summoner_name)
    performance["summoner"] = summoner
