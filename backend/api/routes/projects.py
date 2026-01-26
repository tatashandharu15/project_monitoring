
from fastapi import APIRouter, Query
from backend.storage.repository import load_data

router = APIRouter()


@router.get("/projects")
def list_projects(
    category: str | None = Query(None, description="IT / NON_IT / REVIEW"),
    refresh: bool = Query(False, description="Force refresh data from source")
):
    data = load_data(force_refresh=refresh)

    if category:
        data = [x for x in data if x["category"] == category]

    return data
