from app.infrastructure.observability.tracing import trace_store

LEGACY_RUN_ID = "legacy"


def add_trace(step_type: str, value: str, run_id: str = LEGACY_RUN_ID, agent: str = "supervisor"):
    trace_store.add(run_id=run_id, step=step_type, message=value, agent=agent)


def get_trace(run_id: str | None = None):
    return [step.model_dump(mode="json") for step in trace_store.get(run_id)]


def clear_trace():
    trace_store.clear()
