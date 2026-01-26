# backend/classifier/classify.py

import logging
import os
from .rules import classify_text
from .gemini import analyze_project_with_ai
from .groq_adapter import analyze_with_groq


def classify_record(record: dict) -> dict:
    # 1. Klasifikasi Rule-Based (Cepat)
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

    # 2. Klasifikasi AI (Lebih Akurat tapi Lambat)
    provider = os.getenv("AI_PROVIDER", "gemini").lower()

    # LOGIKA BARU: Jika pakai Groq (Cepat & Gratis), hajar semua data dengan AI
    # Jika pakai Gemini (Terbatas), tetap gunakan optimasi hemat kuota
    should_use_ai = False
    
    if provider == "groq":
        should_use_ai = True
    elif record["category"] == "REVIEW" or record.get("confidence") == "LOW":
        should_use_ai = True
        
    if should_use_ai:
        if provider == "groq":
            ai_result = analyze_with_groq(
                title=record.get("judul", ""),
                description=f"Satker: {record.get('satker', '')}, LPSE: {record.get('lpse', '')}"
            )
        else:
            ai_result = analyze_project_with_ai(
                title=record.get("judul", ""),
                description=f"Satker: {record.get('satker', '')}, LPSE: {record.get('lpse', '')}"
            )
    else:
        ai_result = {
            "ai_category": None,
            "ai_reason": "Skipped (High Confidence Rule)",
            "ai_confidence": "NONE"
        }

    record["ai_category"] = ai_result["ai_category"]
    record["ai_reason"] = ai_result["ai_reason"]
    
    # Opsi: Jika Rule bilang REVIEW tapi AI yakin, kita bisa override
    if record["category"] == "REVIEW" and ai_result["ai_confidence"] == "HIGH":
         if ai_result["ai_category"] in ["IT", "NON-IT"]:
             record["category"] = ai_result["ai_category"]
             record["confidence"] = "MEDIUM-AI"

    return record
