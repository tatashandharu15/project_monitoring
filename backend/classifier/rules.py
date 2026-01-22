# backend/classifier/rules.py

from .keywords import IT_KEYWORDS, NON_IT_KEYWORDS


def classify_text(text: str) -> dict:
    text = text.lower()

    strong_hits = [k for k in IT_KEYWORDS["strong"] if k in text]
    medium_hits = [k for k in IT_KEYWORDS["medium"] if k in text]
    non_it_hits = [k for k in NON_IT_KEYWORDS if k in text]

    if strong_hits:
        return {
            "category": "IT",
            "confidence": "HIGH",
            "matched_keywords": strong_hits
        }

    if medium_hits and not non_it_hits:
        return {
            "category": "IT",
            "confidence": "MEDIUM",
            "matched_keywords": medium_hits
        }

    if non_it_hits:
        return {
            "category": "NON_IT",
            "confidence": "HIGH",
            "matched_keywords": non_it_hits
        }

    return {
        "category": "REVIEW",
        "confidence": "LOW",
        "matched_keywords": []
    }
