from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import backtest

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow from any origin for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(backtest.router, prefix="/api")
