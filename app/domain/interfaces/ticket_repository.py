from abc import ABC, abstractmethod


class TicketRepository(ABC):

    @abstractmethod
    def get_all(self) -> list[str]:
        pass