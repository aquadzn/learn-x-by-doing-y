import time

import requests
import pandas as pd


CODES = set([400, 404, 403, 408, 409, 501, 502, 503])

df = pd.read_csv("projects.csv", sep=";")["url"]


for i, url in df.iteritems():
    print(i)

    r = requests.get(url)
    status_code = r.status_code

    if status_code in CODES:
        print(f"Broken link {i} - Code {status_code}")

    time.sleep(5)
