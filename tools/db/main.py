import os
from db import extractor, inserter

matches = extractor.get_matches(os.getcwd() + "\\output\\custom-matches")

print("Initializing DB...")
inserter.initialize_database()
print("Inserting matches...")
inserter.insert_matches(matches)
print("Done!")

i=1
for match in matches:
    print(f"\nInserting stats for match #{match['id']} ({i}/{len(matches)})...")

    print("\tInserting champion bans...")
    inserter.insert_bans(match["red"]["bans"] + match["blue"]["bans"])

    print("\tInserting summoner stats...")
    inserter.insert_summoner_stats(match)

    print("\tInserting champion stats...")
    inserter.insert_champion_stats(match)
    i += 1

print("Done!")
    