# backend/processor/normalize.py

import re
from datetime import datetime
from typing import Dict


def normalize_hps(hps_text: str | None) -> int | None:
    """
    'Hps Rp 2.000.000.000,00' -> 2000000000
    """
    if not hps_text:
        return None

    # buang desimal ",00"
    clean = hps_text.split(",")[0]

    # ambil hanya digit
    digits = re.sub(r"[^\d]", "", clean)

    return int(digits) if digits else None



def normalize_title(title: str) -> str:
    return title.lower().strip()


def normalize_dates(jadwal_text: str | None) -> Dict[str, datetime | None]:
    """
    '22 January 2026 12:00:00 s/d 27 March 2026 16:00:00'
    """
    if not jadwal_text or "s/d" not in jadwal_text:
        return {"start_date": None, "end_date": None}

    start_raw, end_raw = jadwal_text.split("s/d")

    fmt = "%d %B %Y %H:%M:%S"

    try:
        start = datetime.strptime(start_raw.strip(), fmt)
        end = datetime.strptime(end_raw.strip(), fmt)
    except ValueError:
        return {"start_date": None, "end_date": None}

    return {"start_date": start, "end_date": end}


def normalize_record(record: Dict) -> Dict:
    dates = normalize_dates(record.get("jadwal"))

    return {
        **record,
        "judul_norm": normalize_title(record["judul"]),
        "hps_value": normalize_hps(record.get("hps")),
        "start_date": dates["start_date"],
        "end_date": dates["end_date"],
        "fetched_at": datetime.now() # Tambahkan timestamp saat data diambil
    }
