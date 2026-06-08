from app.domain.models.agent_run import AgentRunResponse
from app.infrastructure.agents.supervisor_agent import SupervisorAgent


class StatusService:
    def __init__(self):
        self.agent = SupervisorAgent()

    def run(self, question: str, session_id: str = "demo-session") -> AgentRunResponse:
        return self.agent.run(question=question, session_id=session_id)

    def get_status(self, question: str):
        return self.run(question).answer

    def list_tools(self):
        return self.agent.tools()
