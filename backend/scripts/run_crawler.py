# backend/scripts/run_crawler.py

from backend.crawler.pengadaan import crawl_pages
from backend.processor.normalize import normalize_record
from backend.classifier.classify import classify_record

def main():
    raw_data = crawl_pages(pages=(1, 2))
    processed = [classify_record(normalize_record(x)) for x in raw_data]

    print(f"\n[RESULT] Total items fetched: {len(processed)}")
    print("\n[PREVIEW AFTER NORMALIZATION]")

    for item in processed[:3]:
        print("-" * 80)
        for k, v in item.items():
            print(f"{k}: {v}")


if __name__ == "__main__":
    main()
