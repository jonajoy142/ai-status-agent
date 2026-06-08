from app.config.settings import settings


class LLMProvider:
    def generate(self, prompt: str) -> str | None:
        if settings.llm_provider == "openai" and settings.openai_api_key:
            return self._openai_generate(prompt)
        if settings.llm_provider == "ollama":
            return self._ollama_generate(prompt)
        return None

    def _openai_generate(self, prompt: str) -> str | None:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=settings.openai_api_key)
            response = client.responses.create(model=settings.openai_model, input=prompt)
            return response.output_text.strip()
        except Exception:
            return None

    def _ollama_generate(self, prompt: str) -> str | None:
        try:
            from langchain_ollama import ChatOllama

            llm = ChatOllama(model=settings.llm_model, temperature=0)
            return llm.invoke(prompt).content.strip()
        except Exception:
            return None


llm_provider = LLMProvider()
