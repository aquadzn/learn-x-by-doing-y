import pandas as pd


JS_FRAMEWORKS = set(
    [
        "Gatsby",
        "Eleventy",
        "Hugo",
        "Node",
        "NodeJS",
        "React",
        "React Native",
        "Angular",
        "Vue",
        "VueJS",
        "NextJS",
        "Adonis JS",
    ]
)

LANGUAGES = set(
    [
        "Python",
        "C/C++",
        "C#",
        "Clojure",
        "F#",
        "Julia",
        "Java",
        "Javascript",
        "Rust",
        "Ruby",
        "Haskell",
        "Golang",
        "PHP",
        "HTML",
        "Scala",
        "Swift",
        "Ocaml",
        "Scala",
        "Arduino",
        "Kotlin",
        "Dart",
        "Erlang",
        "Elixir",
        "TypeScript",
    ]
)


df = pd.read_csv("test.csv", sep=";")
new_values = []

for c, i in df["technology"].iteritems():
    split_techno = i.split(", ")

    if split_techno[0] in JS_FRAMEWORKS:
        new_values.append("Javascript")
    else:
        if len(split_techno) == 1:
            new_values.append(split_techno[0])
        else:
            if split_techno[0] in LANGUAGES:
                new_values.append(split_techno[0])
            else:
                new_values.append(split_techno[1])


df["main_language"] = new_values
df["url"] = df["url"].str.rstrip()

new_df = df[["title", "url", "main_language", "technology"]]

new_df.to_csv("new_test.csv", sep=";", index=None)
