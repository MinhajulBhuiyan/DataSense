"""Simple in-memory token store for validated queries.

This store maps a short UUID token to a validated SQL query and metadata.
Tokens are short-lived (TTL) and meant to be used by the frontend to request
an export without resending raw SQL.
"""
import time
import uuid
from typing import Optional

_STORE = {}

DEFAULT_TTL = 60 * 15  # 15 minutes

def create_token(sql: str, ttl: int = DEFAULT_TTL, meta: Optional[dict] = None) -> str:
    token = uuid.uuid4().hex
    _STORE[token] = {
        "sql": sql,
        "created_at": time.time(),
        "expires_at": time.time() + ttl,
        "meta": meta or {}
    }
    return token

def get_query(token: str) -> Optional[dict]:
    item = _STORE.get(token)
    if not item:
        return None
    if item.get("expires_at", 0) < time.time():
        # expired
        try:
            del _STORE[token]
        except KeyError:
            pass
        return None
    return item

def delete_token(token: str) -> None:
    try:
        del _STORE[token]
    except KeyError:
        pass
