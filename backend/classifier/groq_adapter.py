import os
import json
import logging
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Model Llama 3 8B sangat cepat dan cukup pintar untuk klasifikasi
# Opsi lain: llama3-70b-8192 (lebih pintar tapi limit lebih ketat)
MODEL_NAME = "llama-3.1-8b-instant"

client = None
api_key = os.getenv("GROQ_API_KEY")
if api_key:
    client = Groq(api_key=api_key)

def analyze_with_groq(title: str, description: str = "") -> dict:
    if not client:
        return {
            "ai_category": None,
            "ai_reason": "GROQ_API_KEY not found",
            "ai_confidence": "LOW"
        }

    try:
        prompt = f"""
        Anda adalah sistem klasifikasi proyek pengadaan pemerintah.
        Tugas: Tentukan apakah proyek ini kategori IT atau NON-IT.
        
        Kategori IT: Software, Hardware, Jaringan, Website, Aplikasi, Server, CCTV, Internet, Lisensi.
        Kategori NON-IT: Konstruksi, Gedung, Jalan, Irigasi, ATK, Makanan, Jasa Kebersihan, Kendaraan, Mebel.
        
        Judul: {title}
        Info: {description}
        
        Jawab HANYA JSON valid:
        {{
            "category": "IT" | "NON-IT" | "REVIEW",
            "reason": "Alasan singkat padat",
            "confidence": "HIGH" | "MEDIUM" | "LOW"
        }}
        """

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a JSON-only response bot."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )

        result_text = completion.choices[0].message.content
        result = json.loads(result_text)
        
        return {
            "ai_category": result.get("category"),
            "ai_reason": result.get("reason"),
            "ai_confidence": result.get("confidence")
        }

    except Exception as e:
        logging.error(f"Groq Error: {e}")
        return {
            "ai_category": None,
            "ai_reason": f"Groq Error: {str(e)}",
            "ai_confidence": "LOW"
        }
