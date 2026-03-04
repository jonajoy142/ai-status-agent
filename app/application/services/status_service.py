from app.infrastructure.agents.status_agent import StatusAgent


class StatusService:

    def __init__(self):
        self.agent = StatusAgent()

    def get_status(self, question: str):
        return self.agent.run(question)