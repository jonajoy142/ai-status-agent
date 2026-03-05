from pathlib import Path
import json

DATA_DIR = Path("data")


def load_documents():
    docs = []

    # tickets
    with open(DATA_DIR / "tickets.json") as f:
        tickets = json.load(f)

        for t in tickets:
            docs.append({
                "text": str(t),
                "metadata": {"source": "tickets"}
            })

    # slack
    with open(DATA_DIR / "slack.txt") as f:
        for line in f.readlines():
            docs.append({
                "text": line,
                "metadata": {"source": "slack"}
            })

    # docs
    with open(DATA_DIR / "docs.md") as f:
        docs.append({
            "text": f.read(),
            "metadata": {"source": "docs"}
        })

    return docs