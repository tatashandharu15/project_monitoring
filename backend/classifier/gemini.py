import os
import time
import google.generativeai as genai
from dotenv import load_dotenv
import logging

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)

# Menggunakan versi Flash Lite yang lebih hemat resource
MODEL_NAME = "gemini-2.0-flash-lite"

# Global flag untuk Circuit Breaker
AI_DISABLED = False

def analyze_project_with_ai(title: str, description: str = "") -> dict:
    global AI_DISABLED
    
    if AI_DISABLED:
        return {
            "ai_category": None,
            "ai_reason": "AI Disabled: Quota Exceeded globally",
            "ai_confidence": "NONE"
        }

    if not API_KEY:
        return {
            "ai_category": None,
            "ai_reason": "API Key not configured",
            "ai_confidence": "LOW"
        }

    # Retry mechanism
    max_retries = 3
    base_delay = 5

    for attempt in range(max_retries):
        try:
            # Rate Limiting manual
            time.sleep(base_delay * (attempt + 1))

            model = genai.GenerativeModel(MODEL_NAME)
            
            prompt = f"""
            Anda adalah asisten ahli pengadaan barang dan jasa pemerintah.
            Tugas Anda adalah mengklasifikasikan apakah sebuah proyek lelang termasuk kategori IT (Teknologi Informasi) atau NON-IT.

            Kategori IT meliputi: Software, Hardware, Jaringan, Website, Aplikasi, Server, CCTV, Internet, Lisensi Software, Tenaga Ahli IT.
            Kategori NON-IT meliputi: Konstruksi, Gedung, Jalan, Irigasi, Pengadaan Barang Umum (ATK, Makanan), Jasa Kebersihan, Kendaraan.

            Judul Proyek: {title}
            Deskripsi Tambahan: {description}

            Berikan output dalam format JSON valid tanpa markdown code block:
            {{
                "category": "IT" | "NON-IT" | "REVIEW",
                "reason": "Alasan singkat maksimal 1 kalimat",
                "confidence": "HIGH" | "MEDIUM" | "LOW"
            }}
            """

            response = model.generate_content(prompt)
            
            # Bersihkan response jika ada markdown block
            text = response.text.replace("```json", "").replace("```", "").strip()
            
            import json
            result = json.loads(text)
            
            return {
                "ai_category": result.get("category"),
                "ai_reason": result.get("reason"),
                "ai_confidence": result.get("confidence")
            }

        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg:
                logging.warning(f"Gemini 429 Rate Limit. Retrying in {base_delay * (attempt + 2)}s...")
                time.sleep(base_delay * (attempt + 2))
                continue
            
            logging.error(f"Gemini Error: {e}")
            return {
                "ai_category": None,
                "ai_reason": f"Error: {str(e)}",
                "ai_confidence": "LOW"
            }
    
    # Jika sampai sini berarti retry habis dan masih gagal
    logging.error("Gemini Rate Limit Exceeded permanently. Disabling AI for this session.")
    AI_DISABLED = True
    
    return {
        "ai_category": None,
        "ai_reason": "Rate limit exceeded after retries (AI Disabled)",
        "ai_confidence": "LOW"
    }