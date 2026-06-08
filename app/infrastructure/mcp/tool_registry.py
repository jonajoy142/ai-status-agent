from collections.abc import Callable
from time import perf_counter
from typing import Any

from pydantic import BaseModel, Field

from app.domain.models.agent_run import ToolCallRecord


class ToolDescriptor(BaseModel):
    name: str
    description: str
    input_schema: dict[str, Any] = Field(default_factory=dict)
    output_schema: dict[str, Any] = Field(default_factory=dict)
    mcp_compatible: bool = True
    tags: list[str] = Field(default_factory=list)


class ToolExecutionResult(BaseModel):
    descriptor: ToolDescriptor
    output: Any
    record: ToolCallRecord


class RegisteredTool:
    def __init__(self, descriptor: ToolDescriptor, handler: Callable[..., Any]) -> None:
        self.descriptor = descriptor
        self._handler = handler

    def execute(self, agent: str, **kwargs: Any) -> ToolExecutionResult:
        started = perf_counter()
        try:
            output = self._handler(**kwargs)
            success = True
        except Exception as exc:
            output = {"error": str(exc)}
            success = False

        latency_ms = round((perf_counter() - started) * 1000, 2)
        preview = str(output)
        if len(preview) > 500:
            preview = preview[:497] + "..."

        return ToolExecutionResult(
            descriptor=self.descriptor,
            output=output,
            record=ToolCallRecord(
                tool_name=self.descriptor.name,
                agent=agent,
                input=kwargs,
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

    def execute(self, tool_name: str, agent: str, **kwargs: Any) -> ToolExecutionResult:
        if tool_name not in self._tools:
            raise KeyError(f"Tool not registered: {tool_name}")
        return self._tools[tool_name].execute(agent=agent, **kwargs)
