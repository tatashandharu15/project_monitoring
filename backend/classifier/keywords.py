# backend/classifier/keywords.py

IT_KEYWORDS = {
    "strong": [
        "aplikasi", "sistem informasi", "software",
        "server", "database", "cloud", "hosting",
        "jaringan", "network", "firewall",
        "data center", "cyber", "security",
        "website", "web", "api"
    ],
    "medium": [
        "it", "ti", "digital", "komputer",
        "teknologi", "informasi", "elektronik"
    ]
}

NON_IT_KEYWORDS = [
    "konstruksi", "pembangunan", "jalan",
    "bendungan", "irigasi", "gedung",
    "pengawasan", "rehabilitasi",
    "pemeliharaan", "renovasi"
]
