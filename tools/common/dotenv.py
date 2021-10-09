import os

vars_location = ""
vars_dict = None

def vars():
    global vars_dict
    if vars_dict == None:
        vars_dict = {}
        filename = os.path.realpath("..") + "\\.env"
        with open(filename, "r") as file:
            lines = file.readlines()
            for line in lines:
                pair = line.split("=")
                vars_dict[pair[0]] = pair[1].strip()
    return vars_dict