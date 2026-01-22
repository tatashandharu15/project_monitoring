# backend/crawler/pengadaan.py

import requests
from bs4 import BeautifulSoup
from typing import List, Dict


BASE_URL = "https://pengadaan.info/lelang"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
}


def crawl_pages(pages=(1, 2)) -> List[Dict]:
    """
    Crawl pengadaan.info lelang pages
    Return list of dict
    """
    all_results = []

    for page in pages:
        url = f"{BASE_URL}?page={page}"
        print(f"[CRAWLER] Fetching {url}")

        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        items = soup.select("div.box-list div.item")

        print(f"[CRAWLER] Found {len(items)} items on page {page}")

        for item in items:
            title_tag = item.select_one("h4 a")
            if not title_tag:
                continue

            lpse_tag = item.select_one("h5 span.color-black")
            p_info = item.select_one("p.text-truncate")
            hps_tag = item.select_one("a.btn-success")
            jadwal_tag = item.select_one("a.btn-color-biru")

            metode = satker = tahap = None

            if p_info:
                lines = list(p_info.stripped_strings)
                for line in lines:
                    if line.startswith("Metode"):
                        metode = line.replace("Metode :", "").strip()
                    elif line.startswith("Satker"):
                        satker = line.replace("Satker :", "").strip()

                tahap_tag = p_info.select_one("span.text-tahap")
                if tahap_tag:
                    tahap = tahap_tag.get_text(strip=True)

            all_results.append({
                "judul": title_tag.get_text(strip=True),
                "url": title_tag.get("href"),
                "lpse": lpse_tag.get_text(strip=True) if lpse_tag else None,
                "metode": metode,
                "satker": satker,
                "tahap": tahap,
                "hps": hps_tag.get_text(strip=True) if hps_tag else None,
                "jadwal": jadwal_tag.get_text(strip=True) if jadwal_tag else None,
                "page": page,
            })

    return all_results
