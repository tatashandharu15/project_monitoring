from fastapi import FastAPI
from backend.api.routes import stats, projects

app = FastAPI(
    title="Monitoring Pengadaan API",
    version="0.1.0"
)

app.include_router(stats.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
