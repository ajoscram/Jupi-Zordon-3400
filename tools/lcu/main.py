import os
from lcu import proc, api
from common import writer

def get_output_folder():
    if os.getcwd().endswith("tools"):
        return "./output/lcu-matches"
    else:
        return "."

try:
    port = proc.get_port()
    password = proc.get_password()
    output_folder = get_output_folder()

    api.initialize(port, password)
    matches = api.get_matches(True)

    if len(matches) != 0:
        for match in matches:
            print("Found match {}".format(match["gameId"]))
            writer.write(match, output_folder)
        print("Done!")
    else:
        print("No matches found\n\nPress enter to exit.")
        input()

except Exception as exception:
    print("\nOh no! An error occurred:\n")
    print(exception)
    print("\If the error looks weird you can report thi via an issue on https://github.com/ajoscram/Jupi-Zordon-3400/issues to get it fixed.")
    print("Press enter to exit.")
    input()
    