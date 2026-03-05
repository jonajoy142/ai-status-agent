embedding_cache = {}


def get_cached_embedding(query: str, embed_fn):

    if query in embedding_cache:
        return embedding_cache[query]

    embedding = embed_fn(query)

    embedding_cache[query] = embedding

    return embedding