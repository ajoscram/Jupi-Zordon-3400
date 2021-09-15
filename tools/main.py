import sys
from common import fetcher, writer, parser

summoner_name = sys.argv[1]
raw_output_directory = "output/ranked-matches/raw/"
jupi_output_directory = "output/ranked-matches/jupi/"

# Start with a random summoner.
summoner = fetcher.get_summoner(summoner_name)
# Get that summoner's recent matches.
recent_matches = fetcher.get_match_history(summoner["id"])
# Fetch all matches which have not been added yet.
for match_metadata in recent_matches:
    match_id = str(match_metadata["gameId"])
# For every match:
    if not writer.exists(raw_output_directory + match_id + ".json"):
        raw_match = fetcher.get_match(match_id)
        jupi_match = parser.parse_raw_match(raw_match)
        writer.write(raw_match, raw_output_directory)
        writer.write(jupi_match, jupi_output_directory)
#   Save both the raw match and the Jupi-Zordon version.
#   Repeat the algorithm for all other summoners in the match.