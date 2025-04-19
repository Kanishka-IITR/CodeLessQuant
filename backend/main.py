# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.routes import backtest
# from app.routes import live_price
# from app.routes import auth  # or from backend.routes import auth
# from dotenv import load_dotenv
# load_dotenv()





# app = FastAPI()

# # Allow frontend access
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow from any origin for now
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include router
# app.include_router(backtest.router, prefix="/api")
# app.include_router(live_price.router)
# app.include_router(auth.router, prefix="/auth")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import backtest, live_price, auth
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi
import os

load_dotenv()

app = FastAPI()

# MongoDB Client
# client = MongoClient(os.getenv("MONGO_URL"))
client = MongoClient(os.getenv("MONGO_URL"), tls=True, tlsCAFile=certifi.where())

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(backtest.router, prefix="/api")
app.include_router(live_price.router)
app.include_router(auth.router, prefix="/auth")


