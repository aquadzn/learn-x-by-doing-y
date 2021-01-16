import time

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://create.arduino.cc/projecthub?sort=popular&type=tutorial&page="
PAGES = 20

with open("arduino.txt", "a") as f:

    for page_number in range(1, PAGES):
        
        print(page_number)

        r = requests.get(f"{BASE_URL}{page_number}")
        soup = BeautifulSoup(r.text, "html.parser")

        a = soup.find_all("a", class_="project-link-with-ref")

        for i in range(1, len(a), 2):
            f.write(f"{a[i].string};https://create.arduino.cc{a[i].get('href')};Arduino\n")

        time.sleep(2)
