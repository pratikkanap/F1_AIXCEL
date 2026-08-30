import requests
import time

WIKI_ACTION_API = "https://en.wikipedia.org/w/api.php"

_image_cache = {}
_bio_cache = {}
_page_image_cache = {}
CACHE_TTL = 604800  # 1 week


def _get_cached(store, key):
    if key in store:
        value, expires_at = store[key]
        if time.time() < expires_at:
            return value
    return "MISS"


def _set_cached(store, key, value):
    if value is not None:
        store[key] = (value, time.time() + CACHE_TTL)


def _resolve_title(name: str):
    try:
        params = {
            "action": "opensearch",
            "search": name,
            "limit": 1,
            "namespace": 0,
            "format": "json",
        }
        response = requests.get(
            WIKI_ACTION_API,
            params=params,
            headers={"User-Agent": "F1TelemetryApp/1.0"},
            timeout=6,
        )
        if response.status_code != 200:
            return None
        data = response.json()
        titles = data[1] if len(data) > 1 else []
        return titles[0] if titles else None
    except Exception:
        return None


def _fetch_thumbnail(title: str, size: int = 500):
    try:
        params = {
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": size,
            "redirects": 1,
        }
        response = requests.get(
            WIKI_ACTION_API,
            params=params,
            headers={"User-Agent": "F1TelemetryApp/1.0"},
            timeout=6,
        )
        if response.status_code != 200:
            return None
        data = response.json()
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumbnail = page.get("thumbnail", {}).get("source")
            if thumbnail:
                return thumbnail
        return None
    except Exception:
        return None


def _fetch_extract(title: str):
    try:
        params = {
            "action": "query",
            "titles": title,
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
            "format": "json",
            "redirects": 1,
        }
        response = requests.get(
            WIKI_ACTION_API,
            params=params,
            headers={"User-Agent": "F1TelemetryApp/1.0"},
            timeout=6,
        )
        if response.status_code != 200:
            return None
        data = response.json()
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            extract = page.get("extract")
            if extract:
                sentences = extract.split(". ")
                return ". ".join(sentences[:3]).strip()
        return None
    except Exception:
        return None


def _candidate_titles(name: str):
    """Try increasingly specific title variants to dodge Wikipedia disambiguation collisions."""
    resolved = _resolve_title(name)
    candidates = []
    if resolved:
        candidates.append(resolved)
    candidates.extend([
        f"{name} (racing driver)",
        f"{name} Jr.",
        f"{name} (F1 driver)",
        name,
    ])
    seen = set()
    deduped = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            deduped.append(c)
    return deduped


def get_person_image(name: str):
    cached = _get_cached(_image_cache, name)
    if cached != "MISS":
        return cached

    for title in _candidate_titles(name):
        result = _fetch_thumbnail(title)
        if result:
            _set_cached(_image_cache, name, result)
            return result
    return None


def get_page_image(page_title: str):
    cached = _get_cached(_page_image_cache, page_title)
    if cached != "MISS":
        return cached

    resolved_title = _resolve_title(page_title)
    title = resolved_title or page_title
    result = _fetch_thumbnail(title)
    _set_cached(_page_image_cache, page_title, result)
    return result


def get_person_extract(name: str):
    cached = _get_cached(_bio_cache, name)
    if cached != "MISS":
        return cached

    for title in _candidate_titles(name):
        result = _fetch_extract(title)
        if result:
            _set_cached(_bio_cache, name, result)
            return result
    return None