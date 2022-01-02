import json, os
from datetime import datetime

def get_matches(directory):
    filepaths = [ directory + "\\" + filename for filename in os.listdir(directory) ]
    return [ get_match(filepath) for filepath in filepaths ]

def get_match(filepath):
    with open(filepath, "r") as file:
        match = json.load(file)
        match["date"] = datetime.fromisoformat(match["date"])
    return match