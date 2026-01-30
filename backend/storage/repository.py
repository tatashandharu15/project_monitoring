# backend/storage/repository.py

import json
import os
from datetime import datetime, timedelta
from backend.crawler.pengadaan import crawl_pages
from backend.processor.normalize import normalize_record
from backend.classifier.classify import classify_record

_DATA_CACHE = None
DATA_FILE = "data/projects.json"

def ensure_data_dir():
    os.makedirs("data", exist_ok=True)

def load_from_file():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading cache: {e}")
    return None

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

MAX_ITEMS = 500  # Simpan max 500 item terbaru
RETENTION_DAYS = 7  # Hapus data > 7 hari

def cleanup_old_data(data):
    cutoff = datetime.now() - timedelta(days=RETENTION_DAYS)
    valid_data = []
    
    for item in data:
        # 1. Parsing fetched_at
        f_at = item.get("fetched_at")
        if isinstance(f_at, str):
            try: f_at = datetime.fromisoformat(f_at)
            except: pass
        
        # 2. Hapus jika expired (hanya jika f_at valid)
        if isinstance(f_at, datetime) and f_at < cutoff:
            continue
            
        valid_data.append(item)
        
    # 3. Sort: Prioritaskan Jadwal Mulai Terbaru (start_date)
    def get_sort_key(x):
        s_date = x.get("start_date")
        # Handle string format from JSON
        if isinstance(s_date, str):
             try: s_date = datetime.fromisoformat(s_date)
             except: s_date = None
             
        if not s_date:
            return datetime.min
        return s_date if isinstance(s_date, datetime) else datetime.min

    valid_data.sort(key=get_sort_key, reverse=True)
    
    # 4. Limit jumlah
    return valid_data[:MAX_ITEMS]

def save_to_file(data):
    ensure_data_dir()
    
    # Bersihkan data lama sebelum simpan
    clean_data = cleanup_old_data(data)
    
    with open(DATA_FILE, "w") as f:
        json.dump(clean_data, f, indent=2, default=json_serial)

def load_data(force_refresh: bool = False):
    global _DATA_CACHE

    # 1. Load data lama dari file untuk referensi deduplikasi
    existing_data = load_from_file() or []

    # 2. Jika tidak force_refresh dan memory cache ada, return memory
    if not force_refresh and _DATA_CACHE:
        return _DATA_CACHE
    
    # 3. Jika tidak force_refresh dan file ada, return file content (tanpa crawl)
    if not force_refresh and existing_data:
        _DATA_CACHE = existing_data
        return _DATA_CACHE

    # 4. KONDISI: force_refresh=True ATAU (cache kosong DAN file kosong)
    # Lakukan Crawling + Incremental Update
    print("[REPOSITORY] Starting crawling & incremental update...")
    
    # Map data lama untuk pencarian cepat O(1)
    existing_map = {item.get("url"): item for item in existing_data if item.get("url")}
    
    try:
        raw = crawl_pages(pages=(1, 3))
    except Exception as e:
        print(f"[REPOSITORY] Crawl failed: {e}")
        # Jika crawl gagal, kembalikan data lama jika ada
        if existing_data:
            return existing_data
        
        # Jika tidak ada data lama (first run) dan crawl gagal, return empty list
        # Jangan crash agar dashboard tetap bisa dibuka
        print("[REPOSITORY] Warning: First run crawl failed. Returning empty list.")
        return []

    processed = []
    new_items_count = 0
    
    for item in raw:
        url = item.get("url")
        
        # LOGIKA DEDUPLIKASI: Cek apakah URL sudah ada di data lama
        if url in existing_map:
            # Gunakan data lama (Hemat Quota API Groq/Gemini)
            # Kita asumsikan hasil AI sebelumnya sudah valid
            processed.append(existing_map[url])
        else:
            # Data benar-benar baru -> Panggil AI
            print(f"[REPOSITORY] New item found: {url} -> Calling AI...")
            normalized = normalize_record(item)
            classified = classify_record(normalized)
            processed.append(classified)
            new_items_count += 1
            
    print(f"[REPOSITORY] Update complete. New items classified: {new_items_count}")
    
    _DATA_CACHE = processed
    
    try:
        save_to_file(processed)  # Simpan hasil gabungan ke file
    except Exception as e:
        print(f"[REPOSITORY] Warning: Failed to save data to file: {e}")
        # We continue even if save fails, so the user gets the data

    return _DATA_CACHE
