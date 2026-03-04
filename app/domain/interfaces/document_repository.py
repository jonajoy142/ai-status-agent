from abc import ABC, abstractmethod


class DocumentRepository(ABC):

    @abstractmethod
    def get_all(self) -> list[str]:
        pass