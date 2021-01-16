import pandas as pd


df = pd.read_csv("projects.csv", sep=";")
print(df.shape)

df.drop_duplicates(subset=["url"], inplace=True)
print(df.shape)

df.to_csv("new.csv", sep=";", index=None)
