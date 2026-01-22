# backend/storage/repository.py

from backend.crawler.pengadaan import crawl_pages
from backend.processor.normalize import normalize_record
from backend.classifier.classify import classify_record

_DATA_CACHE = None


def load_data(force_refresh: bool = False):
    global _DATA_CACHE

    if _DATA_CACHE is None or force_refresh:
        raw = crawl_pages(pages=(1, 2))

        processed = []
        for item in raw:
            normalized = normalize_record(item)
            classified = classify_record(normalized)
            processed.append(classified)

        _DATA_CACHE = processed

    return _DATA_CACHE
