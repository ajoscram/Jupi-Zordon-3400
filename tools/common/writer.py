import os, json

def write(match, directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
    filepath = directory + "/" + get_filename(match)
    with open(filepath, "w+") as file:
        json.dump(match, file, indent=4, ensure_ascii=False)

def get_filename(match):
    if "id" in match:
        return match["id"] + ".json"
    else:
        return str(match["gameId"]) + ".json"

def exists(filepath):
    return os.path.isfile(filepath)