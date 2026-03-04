from abc import ABC, abstractmethod


class ChatRepository(ABC):

    @abstractmethod
    def get_all(self) -> list[str]:
        pass