
from fastapi import APIRouter, Query
from backend.storage.repository import load_data

router = APIRouter()


@router.get("/projects")
def list_projects(
    category: str | None = Query(None, description="IT / NON_IT / REVIEW")
):
    data = load_data()

    if category:
        data = [x for x in data if x["category"] == category]

    return data
