# app/services/alpaca_client.py
import os
from dotenv import load_dotenv
import httpx

load_dotenv()

API_KEY = os.getenv("ALPACA_API_KEY")
SECRET_KEY = os.getenv("ALPACA_SECRET_KEY")

HEADERS = {
    "APCA-API-KEY-ID": API_KEY,
    "APCA-API-SECRET-KEY": SECRET_KEY
}

BASE_URL = "https://data.alpaca.markets/v2"

async def get_live_price(ticker: str):
    url = f"{BASE_URL}/stocks/{ticker}/quotes/latest"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
