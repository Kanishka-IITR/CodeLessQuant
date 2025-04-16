# # backend/app/routes/backtest.py

# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from app.services.strategy_parser import convert_xml_to_json
# from app.services.backtester import run_backtest

# router = APIRouter()

# class StrategyPayload(BaseModel):
#     strategy_xml: str

# @router.post("/backtest")
# def run_backtest_route(payload: StrategyPayload):
#     try:
#         strategy_json = convert_xml_to_json(payload.strategy_xml)
#         result = run_backtest(strategy_json)
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# from fastapi import APIRouter, Request
# from pydantic import BaseModel
# from typing import Any, Dict
# from app.services.backtester import run_backtest

# router = APIRouter()

# # ✅ Request model
# class BacktestRequest(BaseModel):
#     symbol: str
#     start_date: str
#     end_date: str
#     code: Dict[str, Any]

# @router.post("/backtest")
# async def backtest(request_data: BacktestRequest):
#     try:
#         result = run_backtest(
#             symbol=request_data.symbol,
#             start_date=request_data.start_date,
#             end_date=request_data.end_date,
#             strategy_json=request_data.code
#         )
#         return result
#     except Exception as e:
#         return {"error": str(e)}

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