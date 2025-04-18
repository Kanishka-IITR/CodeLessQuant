from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import backtest
from app.routes import live_price



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
app.include_router(live_price.router)