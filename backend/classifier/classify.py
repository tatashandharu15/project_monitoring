# backend/classifier/classify.py

import logging
import os
from .rules import classify_text
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

    # 2. Klasifikasi AI (Groq - Cepat & Gratis)
    # Kita gunakan AI untuk SEMUA data untuk akurasi maksimal,
    # karena Groq sangat cepat dan cost-effective.
    
    ai_result = analyze_with_groq(
        title=record.get("judul", ""),
        description=f"Satker: {record.get('satker', '')}, LPSE: {record.get('lpse', '')}"
    )

    record["ai_category"] = ai_result["ai_category"]
    record["ai_reason"] = ai_result["ai_reason"]
    
    # Opsi: Jika Rule bilang REVIEW tapi AI yakin, kita bisa override
    # Atau bahkan kita bisa prioritaskan AI jika confidence HIGH
    if ai_result["ai_confidence"] == "HIGH" and ai_result["ai_category"] in ["IT", "NON-IT"]:
         record["category"] = ai_result["ai_category"]
         record["confidence"] = "HIGH-AI"
    elif record["category"] == "REVIEW" and ai_result["ai_category"] in ["IT", "NON-IT"]:
         record["category"] = ai_result["ai_category"]
         record["confidence"] = "MEDIUM-AI"

    return record
