from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.core.db import engine, Base
from app.core.config import settings

# This line creates all the tables in our database
Base.metadata.create_all(bind=engine)

# start up the FastAPI app!
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for Recipe Extractor & Meal Planner",
    version="1.0.0"
)

# We need CORS so our frontend can talk to our backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allowing everything for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include all our api routes
app.include_router(router, prefix="/api")

@app.get("/health")
def health_check():
    # just a simple check to see if the server is alive
    return {"status": "ok"}
