from pathlib import Path
import json


DATA_DIR = Path("data")


def load_documents():
    docs = []

    # Load tickets
    with open(DATA_DIR / "tickets.json") as f:
        tickets = json.load(f)
        for t in tickets:
            docs.append(str(t))

    # Load slack
    with open(DATA_DIR / "slack.txt") as f:
        docs.extend(f.readlines())

    # Load docs
    with open(DATA_DIR / "docs.md") as f:
        docs.append(f.read())

    return docs