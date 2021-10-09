import sys
from common import writer
from custom import ids, po

username = sys.argv[1]
password = sys.argv[2]
ids_file_path = sys.argv[3]
matches_directory = sys.argv[4]

match_ids = ids.get_match_ids(username, ids_file_path, matches_directory)

po.initialize()

for match_id in match_ids:
    print("Getting " + match_id)
    match = po.get_match(username, password, match_id)
    writer.write(match, matches_directory)
    print("Saved!\n")

po.finalize()