conversation_memory = []


def add_memory(question: str, answer: str):

    conversation_memory.append({
        "question": question,
        "answer": answer
    })


def get_memory(limit: int = 5):

    return conversation_memory[-limit:]