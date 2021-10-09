from common import fetcher, writer, parser

raw_output_directory = "output/ranked-matches/raw/"
jupi_output_directory = "output/ranked-matches/jupi/"

summoners = None
maximum_summoners = None
index = None

def initialize(seed_summoner_name, max_summoners):
    global summoners, maximum_summoners, index
    index = 0
    maximum_summoners = max_summoners
    summoners = [ fetcher.get_summoner(seed_summoner_name) ]

def get_next_summoner():
    global summoners, index
    next = None
    if index < len(summoners):
        next = summoners[index]
        index += 1
    return next

def get_current_summoner_indexer():
    global summoners, index
    summoners_length = "?" if len(summoners) == 1 else len(summoners)
    return f"[ {index} / {summoners_length} ]"

def get_match_history(summoner):
    try:
        return fetcher.get_match_history(summoner["id"])
    except KeyError:
        return []

def try_register_match(match_id):
    is_match_new = not writer.exists(raw_output_directory + match_id + ".json")
    if is_match_new:
        raw_match = fetcher.get_match(match_id)
        jupi_match = parser.parse_raw_match(raw_match)

        writer.write(raw_match, raw_output_directory)
        writer.write(jupi_match, jupi_output_directory)

        register_team_summoners(jupi_match["blue"])
        register_team_summoners(jupi_match["red"])
    return is_match_new

def register_team_summoners(team_stats):
    global summoners, maximum_summoners
    for performance in team_stats["performanceStats"]:
        summoner = performance["summoner"]
        if len(summoners) < maximum_summoners and summoner not in summoners:
            summoners += [summoner]