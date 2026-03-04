import json



class FileTicketRepository(TicketRepository):

    def __init__(self, path="data/tickets.json"):
        self.path = path

    def get_all(self) -> list[str]:
        with open(self.path) as f:
            data = json.load(f)

        return [str(ticket) for ticket in data]