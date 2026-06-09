from app.infrastructure.demo.operating_data import EVALUATIONS


class EvaluationAgent:
    name = "evaluation"

    def summarize(self):
        score = round(sum(evaluation.score for evaluation in EVALUATIONS) / len(EVALUATIONS))
        return {"average_score": score, "checks": EVALUATIONS}
