from app.domain.interfaces.document_repository import DocumentRepository


class FileDocsRepository(DocumentRepository):

    def __init__(self, path="data/docs.md"):
        self.path = path

    def get_all(self) -> list[str]:
        with open(self.path) as f:
            return [f.read()]