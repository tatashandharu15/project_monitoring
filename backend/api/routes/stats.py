from fastapi import APIRouter
from backend.storage.repository import load_data

router = APIRouter()


@router.get("/stats")
def get_stats():
    data = load_data()

    stats = {
        "total": len(data),
        "it": sum(1 for x in data if x["category"] == "IT"),
        "non_it": sum(1 for x in data if x["category"] == "NON_IT"),
        "review": sum(1 for x in data if x["category"] == "REVIEW"),
    }

    return stats
