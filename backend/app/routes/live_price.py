# app/routes/live_price.py
from fastapi import APIRouter, HTTPException
from app.services.alpaca_client import get_live_price

router = APIRouter()

@router.get("/live-price/{ticker}")
async def fetch_live_price(ticker: str):
    try:
        data = await get_live_price(ticker.upper())
        return {
            "ticker": ticker.upper(),
            "ask_price": data["quote"]["ap"],
            "bid_price": data["quote"]["bp"],
            "timestamp": data["quote"]["t"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
