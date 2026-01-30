from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from backend.api.routes import stats, projects
import logging
import traceback

app = FastAPI(
    title="Monitoring Pengadaan API",
    version="0.1.0"
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Global Exception: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}", "trace": traceback.format_exc()},
    )

app.include_router(stats.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
