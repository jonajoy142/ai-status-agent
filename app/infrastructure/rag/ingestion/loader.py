from pathlib import Path
import json

DATA_DIR = Path("data")


def load_documents():
    docs = []

    with open(DATA_DIR / "tickets.json") as f:
        tickets = json.load(f)
        for ticket in tickets:
            text = json.dumps(ticket, ensure_ascii=False)
            docs.append({
                "text": text,
                "metadata": {
                    "source": "tickets",
                    "title": ticket.get("title", ticket.get("id", "Ticket")),
                    "id": ticket.get("id", ""),
                    "owner": ticket.get("assignee", ""),
                    "status": ticket.get("status", ""),
                    "priority": ticket.get("priority", ""),
                },
            })

    with open(DATA_DIR / "slack.txt") as f:
        for index, line in enumerate(f.readlines(), start=1):
            text = line.strip()
            if not text:
                continue
            docs.append({
                "text": text,
                "metadata": {
                    "source": "slack",
                    "title": f"Engineering chat update {index}",
                    "id": f"slack-{index}",
                },
            })

    with open(DATA_DIR / "docs.md") as f:
        text = f.read().strip()
        if text:
            docs.append({
                "text": text,
                "metadata": {
                    "source": "docs",
                    "title": "Project Phoenix Engineering Brief",
                    "id": "project-phoenix-brief",
                },
            })

    return docs
