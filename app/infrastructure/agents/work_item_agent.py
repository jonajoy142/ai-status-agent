from app.infrastructure.demo.operating_data import WORK_ITEMS


class WorkItemAgent:
    name = "work_item"

    def analyze(self):
        return {
            "stale_items": [item for item in WORK_ITEMS if item.stale_score >= 30],
            "overloaded_owners": {"Rahul": 3, "Maya": 2, "Nora": 2},
            "suggested_actions": [item.suggested_next_action for item in WORK_ITEMS[:3]],
        }
