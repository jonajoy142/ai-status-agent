from collections import defaultdict
from threading import Lock
from typing import Any

from opentelemetry import trace

from app.domain.models.agent_run import TraceStep

tracer = trace.get_tracer("sprintpilot-ai")


class InMemoryTraceStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._steps: dict[str, list[TraceStep]] = defaultdict(list)

    def add(self, run_id: str, step: str, message: str, agent: str = "supervisor", metadata: dict[str, Any] | None = None) -> TraceStep:
        metadata = metadata or {}
        trace_step = TraceStep(
            run_id=run_id,
            step=step,
            agent=agent,
            message=message,
            metadata=metadata,
        )
        with tracer.start_as_current_span(f"agent.{agent}.{step}") as span:
            span.set_attribute("agent.run_id", run_id)
            span.set_attribute("agent.name", agent)
            span.set_attribute("agent.step", step)
            span.set_attribute("agent.message", message[:500])
            for key, value in metadata.items():
                if isinstance(value, str | int | float | bool):
                    span.set_attribute(f"agent.metadata.{key}", value)
        with self._lock:
            self._steps[run_id].append(trace_step)
        return trace_step

    def get(self, run_id: str | None = None) -> list[TraceStep]:
        with self._lock:
            if run_id:
                return list(self._steps.get(run_id, []))
            steps: list[TraceStep] = []
            for run_steps in self._steps.values():
                steps.extend(run_steps)
            return steps[-200:]

    def clear(self) -> None:
        with self._lock:
            self._steps.clear()


trace_store = InMemoryTraceStore()
