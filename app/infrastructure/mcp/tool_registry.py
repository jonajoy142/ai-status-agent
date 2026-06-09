from collections.abc import Callable
from time import perf_counter
from typing import Any

from pydantic import BaseModel, Field

from app.domain.models.agent_run import ToolCallRecord


class ToolAuthContext(BaseModel):
    workspace_id: str = "demo-workspace"
    user_id: str = "demo-user"
    auth_type: str = "mock"
    scopes: list[str] = Field(default_factory=list)


class ToolExecutionOptions(BaseModel):
    timeout_seconds: float = 8.0
    max_retries: int = 1


class ToolDescriptor(BaseModel):
    name: str
    description: str
    input_schema: dict[str, Any] = Field(default_factory=dict)
    output_schema: dict[str, Any] = Field(default_factory=dict)
    mcp_compatible: bool = True
    tags: list[str] = Field(default_factory=list)
    auth_required: bool = False
    timeout_seconds: float = 8.0


class ToolExecutionResult(BaseModel):
    descriptor: ToolDescriptor
    output: Any
    record: ToolCallRecord
    attempts: int = 1


class RegisteredTool:
    def __init__(self, descriptor: ToolDescriptor, handler: Callable[..., Any]) -> None:
        self.descriptor = descriptor
        self._handler = handler

    def execute(
        self,
        agent: str,
        auth_context: ToolAuthContext | None = None,
        options: ToolExecutionOptions | None = None,
        **kwargs: Any,
    ) -> ToolExecutionResult:
        started = perf_counter()
        options = options or ToolExecutionOptions(timeout_seconds=self.descriptor.timeout_seconds)
        attempts = 0
        output: Any = None
        success = False

        for attempt in range(options.max_retries + 1):
            attempts = attempt + 1
            try:
                output = self._handler(**kwargs)
                success = True
                break
            except Exception as exc:
                output = {"error": str(exc), "attempt": attempts}

        latency_ms = round((perf_counter() - started) * 1000, 2)
        preview = str(output)
        if len(preview) > 500:
            preview = preview[:497] + "..."

        input_payload = dict(kwargs)
        if auth_context:
            input_payload["auth_context"] = auth_context.model_dump(mode="json")

        return ToolExecutionResult(
            descriptor=self.descriptor,
            output=output,
            attempts=attempts,
            record=ToolCallRecord(
                tool_name=self.descriptor.name,
                agent=agent,
                input=input_payload,
                output_preview=preview,
                latency_ms=latency_ms,
                success=success,
            ),
        )


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, RegisteredTool] = {}

    def register(self, descriptor: ToolDescriptor, handler: Callable[..., Any]) -> None:
        self._tools[descriptor.name] = RegisteredTool(descriptor, handler)

    def list_tools(self) -> list[ToolDescriptor]:
        return [tool.descriptor for tool in self._tools.values()]

    def execute(
        self,
        tool_name: str,
        agent: str,
        auth_context: ToolAuthContext | None = None,
        options: ToolExecutionOptions | None = None,
        **kwargs: Any,
    ) -> ToolExecutionResult:
        if tool_name not in self._tools:
            raise KeyError(f"Tool not registered: {tool_name}")
        return self._tools[tool_name].execute(agent=agent, auth_context=auth_context, options=options, **kwargs)
