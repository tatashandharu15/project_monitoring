from fastapi import APIRouter, Query, HTTPException
from backend.storage.repository import load_data
import logging
import traceback

router = APIRouter()


@router.get("/stats")
def get_stats(
    refresh: bool = Query(False, description="Force refresh data from source")
):
    try:
        data = load_data(force_refresh=refresh)
    except Exception as e:
        logging.error(f"Error loading stats: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to load data: {str(e)}")

    stats = {
        "total": len(data),
        "it": sum(1 for x in data if x["category"] == "IT"),
        "non_it": sum(1 for x in data if x["category"] == "NON_IT"),
        "review": sum(1 for x in data if x["category"] == "REVIEW"),
    }

    return stats
