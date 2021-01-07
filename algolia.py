import os
import csv

import requests
from algoliasearch.search_client import SearchClient

import config


client = SearchClient.create("08KMSERF1B", config.KEY)
index = client.init_index("Project")


def add_records(filename: str, method: str):

    if method == "local":
        with open(filename, newline="") as f:
            csv_r = list(csv.DictReader(f, delimiter=";"))
            len_idx = index.search("")["nbHits"]

            if len(csv_r) > len_idx:
                index.save_objects(
                    csv_r[len_idx:], {"autoGenerateObjectIDIfNotExist": "true"}
                )
                print(f"{len(csv_r[len_idx:]) - 1} new records added.")
                return

        print("Nothing new.")

    elif method == "github":
        r = requests.get(
            f"https://raw.githubusercontent.com/aquadzn/learn-x-by-doing-y/main/{filename}"
        )

        with open(f"/tmp/{filename}", "wb") as f:
            f.write(r.content)

            csv_r = list(csv.DictReader(f, delimiter=";"))
            len_idx = index.search("")["nbHits"]

            if len(csv_r) > len_idx:
                index.save_objects(
                    csv_r[len_idx:], {"autoGenerateObjectIDIfNotExist": "true"}
                )
                print(f"{len(csv_r[len_idx:]) - 1} new records added.")
                return

        print("Nothing new.")
        os.remove(f"/tmp/{filename}")

    else:
        print("Wrong method")


if __name__ == "__main__":
    add_records("projects.csv", method="local")
