# backend/classifier/rules.py

from .keywords import IT_KEYWORDS, NON_IT_KEYWORDS


def classify_text(text: str) -> dict:
    text = text.lower()

    strong_it = [k for k in IT_KEYWORDS["strong"] if k in text]
    medium_it = [k for k in IT_KEYWORDS["medium"] if k in text]
    non_it = [k for k in NON_IT_KEYWORDS if k in text]

    # 1️⃣ KONSTRUKSI / NON-IT MENGALAHKAN IT LEMAH
    if non_it and not strong_it:
        return {
            "category": "NON_IT",
            "confidence": "HIGH",
            "matched_keywords": non_it
        }

    # 2️⃣ IT STRONG TANPA KONSTRUKSI
    if strong_it and not non_it:
        return {
            "category": "IT",
            "confidence": "HIGH",
            "matched_keywords": strong_it
        }

    # 3️⃣ IT STRONG + KONSTRUKSI → REVIEW
    if strong_it and non_it:
        return {
            "category": "REVIEW",
            "confidence": "MEDIUM",
            "matched_keywords": strong_it + non_it
        }

    # 4️⃣ IT MEDIUM SAJA
    if medium_it:
        return {
            "category": "REVIEW",
            "confidence": "LOW",
            "matched_keywords": medium_it
        }

    return {
        "category": "REVIEW",
        "confidence": "LOW",
        "matched_keywords": []
    }
