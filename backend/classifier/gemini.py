import os
import time
from google import genai
from dotenv import load_dotenv
import logging
import json

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        logging.error(f"Failed to initialize Gemini Client: {e}")

# Menggunakan versi Flash Lite yang lebih hemat resource
# Note: Check if "gemini-2.0-flash-lite" is valid in new SDK, otherwise use "gemini-2.0-flash"
MODEL_NAME = "gemini-2.0-flash" 

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

    if not client:
        return {
            "ai_category": None,
            "ai_reason": "Gemini Client not initialized (API Key missing or invalid)",
            "ai_confidence": "LOW"
        }

    # Retry mechanism
    max_retries = 3
    base_delay = 5

    for attempt in range(max_retries):
        try:
            # Rate Limiting manual
            time.sleep(base_delay * (attempt + 1))

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

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            
            # Bersihkan response jika ada markdown block
            text = response.text.replace("```json", "").replace("```", "").strip()
            
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
