from backend.crawler.pengadaan import crawl_pages

def main():
    data = crawl_pages(pages=(1, 2))
    print(f"Fetched {len(data)} items")

if __name__ == "__main__":
    main()
