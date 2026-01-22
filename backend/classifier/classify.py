# backend/classifier/classify.py

from .rules import classify_text


def classify_record(record: dict) -> dict:
    text = " ".join(
        filter(None, [
            record.get("judul_norm"),
            record.get("satker", ""),
            record.get("lpse", "")
        ])
    )

    result = classify_text(text)

    record["category"] = result["category"]
    record["confidence"] = result["confidence"]
    record["matched_keywords"] = result["matched_keywords"]

    return record
