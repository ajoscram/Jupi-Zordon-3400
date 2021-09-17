import sys, time
from ranked import register

summoner_name = sys.argv[1]
maximum_summoners = sys.argv[2]

register.initialize(summoner_name, int(maximum_summoners))
current_summoner = register.get_next_summoner()

while current_summoner != None:
    print("Registering matches for: " + current_summoner["name"] + " " + register.get_current_summoner_indexer() + "\n")

    recent_matches = register.get_match_history(current_summoner)
    if recent_matches == []:
        print("None found.")

    for match_metadata in recent_matches:
        match_id = str(match_metadata["gameId"])
        
        try:
            if register.try_register_match(match_id):
                print("Added new match: " + match_id)
            else:
                print("Skipped match since it was already added: " + match_id)
        except Exception as exception:
            print("An error occurred while registering match: " + match_id)
            print("\t" + str(exception))

        time.sleep(5)
    print("\n---------------------------------------------\n")
    current_summoner = register.get_next_summoner()
    
print("Done!")