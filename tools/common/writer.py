import os, json

def write(dictionary, directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
    filepath = directory + "/" + dictionary["id"] + ".json"
    with open(filepath, "w+") as file:
        json.dump(dictionary, file, indent=4, ensure_ascii=False)