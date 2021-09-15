import datetime
from common import fetcher

def parse_raw_match(raw_match, serverIdentity=None):
    return {
        "id": str(raw_match["gameId"]),
        "date": get_date(raw_match),
        "minutesPlayed": get_minutes_played(raw_match),
        "serverIdentity": serverIdentity,
        "blue": get_team_stats(raw_match, 100),
        "red": get_team_stats(raw_match, 200),
    }

def get_date(raw_match):
    date = datetime.datetime.fromtimestamp(raw_match["gameCreation"] / 1000.0)
    return date.strftime('%Y-%m-%d %H:%M:%S.%f')

def get_minutes_played(raw_match):
    minutes = raw_match["gameDuration"] // 60
    if raw_match["gameDuration"] % 60 >= 30:
        minutes += 1
    return minutes

def get_team_stats(raw_match, team_id):
    stats = get_raw_team_stats(raw_match, team_id)
    return {
        "won": stats["win"] == "Win",
        "dragons": stats["dragonKills"],
        "heralds": stats["riftHeraldKills"],
        "barons": stats["baronKills"],
        "towers": stats["towerKills"],
        "bans": get_team_bans(stats["bans"]),
        "performanceStats": get_team_performances(raw_match, team_id)
    }

def get_raw_team_stats(raw_match, team_id):
    for raw_team_stats in raw_match["teams"]:
        if raw_team_stats["teamId"] == team_id:
            return raw_team_stats
    raise ValueError("Raw team with id " + team_id + " not found")

def get_team_bans(raw_bans):
    return [ fetcher.get_champion(str(ban["championId"])) for ban in raw_bans ]

def get_team_performances(raw_match, team_id):
    performances = []
    for participant in raw_match["participants"]:
        if participant["teamId"] == team_id:
            performances += [ get_performance_stats(raw_match, participant["participantId"]) ]
    return performances

def get_performance_stats(raw_match, participant_id):
    raw_performance = get_raw_performance(raw_match["participants"], participant_id)
    summoner = get_summoner(raw_match["participantIdentities"], participant_id)
    champion = fetcher.get_champion(str(raw_performance["championId"]))
    return {
        "summoner": summoner,
        "champion": champion,
        "assists": raw_performance["stats"]["assists"],
        "deaths": raw_performance["stats"]["deaths"],
        "damageDealtToChampions": raw_performance["stats"]["totalDamageDealtToChampions"],
        "damageDealtToObjectives": raw_performance["stats"]["damageDealtToObjectives"],
        "damageReceived": raw_performance["stats"]["totalDamageTaken"],
        "gold": raw_performance["stats"]["goldEarned"],
        "kills": raw_performance["stats"]["kills"],
        "minions": raw_performance["stats"]["totalMinionsKilled"] + raw_performance["stats"]["neutralMinionsKilled"],
        "minutesPlayed": get_minutes_played(raw_match),
        "visionScore": raw_performance["stats"]["visionScore"],
        "crowdControlScore": raw_performance["stats"]["timeCCingOthers"],
        "largestMultikill": raw_performance["stats"]["largestMultiKill"],
        "largestKillingSpree": raw_performance["stats"]["largestKillingSpree"],
        "firstBlood": raw_performance["stats"]["firstBloodKill"],
        "firstTower": raw_performance["stats"]["firstTowerKill"],
        "pentakills": raw_performance["stats"]["pentaKills"],
        "role": get_role(raw_performance["timeline"]["role"], raw_performance["timeline"]["lane"])
    }

def get_raw_performance(raw_performances, participant_id):
    for performance in raw_performances:
        if performance["participantId"] == participant_id:
            return performance
    raise ValueError("A participant's performance with ID " + participant_id + " was not found")

def get_summoner(raw_identities, participant_id):
    try:
        for identity in raw_identities:
            if identity["participantId"] == participant_id:
                return {
                    "id": identity["player"]["accountId"],
                    "name": identity["player"]["summonerName"],
                }
        raise ValueError("A participant's identity with ID " + participant_id + " was not found")
    except KeyError:
        return None

def get_role(raw_role, raw_lane):
    if raw_role == "SOLO" and raw_lane == "MIDDLE":
        return "MIDDLE"
    elif raw_role == "SOLO" and raw_lane == "TOP":
        return "TOP"
    elif raw_role == "DUO_CARRY" and raw_lane == "BOTTOM":
        return "CARRY"
    elif raw_role == "DUO_SUPPORT" and raw_lane == "BOTTOM":
        return "SUPPORT"
    elif raw_role == "JUNGLE":
        return "JUNGLE"
    else:
        return "UNKNOWN"