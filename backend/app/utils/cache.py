import time
import functools

_cache_store = {}
DEFAULT_TTL = 3600


def ttl_cache(ttl=DEFAULT_TTL):
    """Simple in-memory cache decorator with expiry, keyed by function args."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = (func.__name__, args, tuple(sorted(kwargs.items())))
            now = time.time()

            if key in _cache_store:
                value, expires_at = _cache_store[key]
                if now < expires_at:
                    return value

            result = func(*args, **kwargs)
            _cache_store[key] = (result, now + ttl)
            return result
        return wrapper
    return decorator


def clear_cache():
    """Manually clear all cached responses (useful during development/testing)."""
    _cache_store.clear()