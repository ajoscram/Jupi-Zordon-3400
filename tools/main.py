from common import parser

# https://developer.riotgames.com/apis#match-v4/GET_getMatchlist

# Start with a random player.
# Get that player's recent matches.
# Fetch all matches which have not been added yet.
# For every match:
#   Save both the raw match and the Jupi-Zordon version.
#   Repeat the algorithm for all other players in the match.