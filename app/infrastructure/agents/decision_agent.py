from app.infrastructure.demo.operating_data import DECISIONS


class DecisionAgent:
    name = "decision"

    def analyze(self):
        return {"decisions_needed": DECISIONS}
