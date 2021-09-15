import csv, os

def get_match_ids(summoner_name, csv_path, matches_directory):
    ids = []
    with open(csv_path) as file:
        table = list(csv.reader(file, delimiter=";"))
        column_number = get_column_number(table, summoner_name)
        for row in table[1:]:
            ids += [row[column_number]]
    return [ id for id in ids if not os.path.exists(matches_directory + id + ".json") ]

def get_column_number(table, summoner_name):
    firstRow = table[0]
    number = 0
    while number < len(firstRow):
        if firstRow[number] == summoner_name:
            return number
        number += 1
    raise ValueError("Could not find summoner name in the csv")