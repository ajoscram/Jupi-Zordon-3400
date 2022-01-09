from id_update import updater
from common import writer
import os, json

in_dir = "./output/custom-matches"
out_dir = "./output/updated-custom-matches"

remaining_filenames = [ filename
    for filename in os.listdir(in_dir)
    if not os.path.isfile(out_dir + "/" + filename)
]

i = 1
for filename in remaining_filenames:
    print(f"Updating {filename} ({i}/{len(remaining_filenames)})...")
    with open(in_dir + "/" + filename, "r") as in_file:
        match = json.load(in_file)
        updater.update(match)
        writer.write(match, out_dir)
    i += 1