import pymongo
from pymongo import MongoClient
from pymongo.operations import UpdateOne
from common import dotenv

client = MongoClient(dotenv.vars()["MONGO_URL"])
database = client[dotenv.vars()["DATABASE_NAME"]]

def initialize_database():
    database["static"].create_index(
        [
            ("name", pymongo.DESCENDING)
        ], unique=True, name ="name")
    database["completed_matches"].create_index(
        [
            ("serverIdentity.id", pymongo.DESCENDING),
            ("date", pymongo.DESCENDING)
        ], name ="serverIdentity.id, date")
    database["completed_matches"].create_index(
        [ ("id", pymongo.DESCENDING) ],
        unique=True, name ="id")
    database["ongoing_matches"].create_index(
        [
            ("serverIdentity.id", pymongo.DESCENDING),
            ("date", pymongo.DESCENDING),

        ], name ="serverIdentity.id, date")
    database["ongoing_matches"].create_index(
        [ ("id", pymongo.DESCENDING) ],
        unique=True, name ="id")
    database["summoner_stats"].create_index(
        [
            ("summoner.id", pymongo.DESCENDING),
            ("picks.champion.id", pymongo.DESCENDING)
        ],
        unique=True, name ="summoner.id, picks.champion.id")
    database["champion_stats"].create_index(
        [ ("champion.id", pymongo.DESCENDING) ],
        unique=True, name ="champion.id")
    database["accounts"].create_index(
        [ ("user.id", pymongo.DESCENDING) ],
         unique=True, name ="user.id")
    database["accounts"].create_index(
        [ ("summoner.id", pymongo.DESCENDING) ],
        unique=True, name ="summoner.id")

def insert_matches(matches):
    database["completed_matches"].insert_many(matches)

def insert_bans(bans):
    operations = [ create_ban_operation(champion) for champion in bans ]
    database["champion_stats"].bulk_write(operations)

def create_ban_operation(champion):
    return UpdateOne(
        { "champion.id": champion["id"] },
        { 
            "$setOnInsert": { "champion": champion },
            "$inc": { "bans": 1 }
        },
        upsert=True)

def insert_summoner_stats(match):
    operations = create_summoner_stats_operations(match["blue"], match["minutesPlayed"])
    operations += create_summoner_stats_operations(match["red"], match["minutesPlayed"])
    database["summoner_stats"].bulk_write(operations)

def insert_champion_stats(match):
    operations = [
        create_champion_stats_operation(performance, match["blue"]["won"], match["minutesPlayed"])
        for performance in match["blue"]["performanceStats"]
    ]
    operations += [
        create_champion_stats_operation(performance, match["red"]["won"], match["minutesPlayed"])
        for performance in match["red"]["performanceStats"]
    ]
    database["champion_stats"].bulk_write(operations)

def create_champion_stats_operation(performance, won, minutes_played):
    return UpdateOne(
        { "champion.id": performance["champion"]["id"] },
        {
            "$setOnInsert": { "champion": performance["champion"] },
            "$inc": { "picks": 1 } | create_overall_stats_increment(performance, won, minutes_played)
        },
        upsert=True
    )

def create_summoner_stats_operations(team_stats, minutes_played):
    operations = []
    for performance in team_stats["performanceStats"]:
        operations += [ 
            create_main_summoner_stats_operation(performance, team_stats["won"], minutes_played),
            create_pick_operation(performance["summoner"], performance["champion"]),
            increment_pick_operation(performance["summoner"], performance["champion"])
        ]
    return operations

def create_main_summoner_stats_operation(performance, won, minutes_played):
    return UpdateOne(
        { "summoner.id": performance["summoner"]["id"] },
        {
            "$setOnInsert": {
                "summoner": performance["summoner"],
                "picks": []
            },
            "$inc": create_overall_stats_increment(performance, won, minutes_played)
        },
        upsert=True
    )

def create_pick_operation(summoner, champion):
    return UpdateOne(
        {
            "summoner.id": summoner["id"],
            "picks.champion.id": { "$ne": champion["id"] }
        },
        {
            "$push": { "picks": { "champion": champion } }
        }
    )

def increment_pick_operation(summoner, champion):
    return UpdateOne(
        {
            "summoner.id": summoner["id"],
            "picks.champion.id": champion["id"]
        },
        {
            "$inc": { "picks.$.count": 1 }
        }
    )

def create_overall_stats_increment(performance, won, minutes_played):
    return {
        "wins": 1 if won else 0,
        "losses": 1 if not won else 0,
        "minutesPlayed": minutes_played,
        "assists": performance["assists"],
        "deaths": performance["deaths"],
        "damageDealtToChampions": performance["damageDealtToChampions"],
        "damageDealtToObjectives": performance["damageDealtToObjectives"],
        "damageReceived": performance["damageReceived"],
        "gold": performance["gold"],
        "kills": performance["kills"],
        "minions": performance["minions"],
        "visionScore": performance["visionScore"],
        "crowdControlScore": performance["crowdControlScore"],
        "pentakills": performance["pentakills"]
    }