

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.backtester import run_backtest

router = APIRouter()

class BacktestRequest(BaseModel):
    symbol: str
    start_date: str
    end_date: str
    code: List[Dict[str, Any]]  # ✅ code is a list of rule dictionaries

@router.post("/backtest")
async def backtest(request_data: BacktestRequest):
    try:
        print("Received request:", request_data)
        result = run_backtest(
            symbol=request_data.symbol,
            start_date=request_data.start_date,
            end_date=request_data.end_date,
            strategy_json=request_data.code
        )
        return result
    except Exception as e:
        return {"error": str(e)}