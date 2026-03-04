from app.domain.interfaces.chat_repository import ChatRepository


class FileChatRepository(ChatRepository):

    def __init__(self, path="data/slack.txt"):
        self.path = path

    def get_all(self) -> list[str]:
        with open(self.path) as f:
            return f.readlines()