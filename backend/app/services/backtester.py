import pandas as pd
from .data_fetcher import get_data
from .data_fetcher import fetch_and_save_data

# 📈 RSI calculation
def calculate_rsi(df, period=14):
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    df['RSI'] = 100 - (100 / (1 + rs))
    return df

# 🚀 Main backtesting function
def run_backtest(symbol, start_date, end_date, strategy_json):
    # ✅ Load and clean data
    fetch_and_save_data(symbol, start_date, end_date)
    df = get_data(symbol, start_date, end_date)

    if "Date" not in df.columns:
        raise ValueError("'Date' column not found in the data")

    df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
    df.dropna(subset=["Close"], inplace=True)
    df["Date"] = pd.to_datetime(df["Date"])
    df.set_index("Date", inplace=True)

    # 🛠 Apply indicators (SMA/RSI)
    for rule in strategy_json:
        if rule["type"] == "IF":
            cond = rule["condition"]
            if cond["type"] == "SMA":
                period = cond["period"]
                df["SMA"] = df["Close"].rolling(window=period).mean()
            elif cond["type"] == "RSI":
                period = cond.get("period", 14)
                df = calculate_rsi(df, period)

    # 💼 Simulate trades
    balance = 10000
    position = None
    entry_price = 0
    trades = []

    for i in range(len(df)):
        row = df.iloc[i]
        date = row.name
        close = row["Close"]

        for rule in strategy_json:
            if rule["type"] != "IF":
                continue

            cond = rule["condition"]
            action = rule["do"]["type"]
            signal = None

            # ➕ SMA condition
            if cond["type"] == "SMA":
                sma = row.get("SMA")
                if pd.isna(sma): continue
                op, val = cond["operator"], cond.get("right", 0)
                if op == "GT" and close > sma: signal = action
                elif op == "LT" and close < sma: signal = action
                elif op == "EQ" and close == sma: signal = action

            # ➕ RSI condition
            elif cond["type"] == "RSI":
                rsi = row.get("RSI")
                if pd.isna(rsi): continue
                op, val = cond["operator"], cond.get("right", 0)
                if op == "GT" and rsi > val: signal = action
                elif op == "LT" and rsi < val: signal = action
                elif op == "EQ" and rsi == val: signal = action

            # 🟢 BUY
            if signal == "BUY" and position is None:
                entry_price = close
                position = close
                trades.append({
                    "date": str(date.date()),
                    "action": "BUY",
                    "price": round(close, 2)
                })

            # 🔴 SELL
            elif signal == "SELL" and position is not None:
                profit = close - entry_price
                balance += profit
                trades.append({
                    "date": str(date.date()),
                    "action": "SELL",
                    "price": round(close, 2),
                    "pnl": round(profit, 2)
                })
                position = None

    # 📊 Metrics
    final_balance = round(balance, 2)
    returns = df["Close"].pct_change().dropna()
    sharpe = (returns.mean() / returns.std()) * (252 ** 0.5) if returns.std() else 0

    return {
        "final_balance": float(final_balance),
        "starting_balance": 10000.0,
        "total_trades": len(trades),
        "sharpe_ratio": round(sharpe, 2),
        "trades": [
            {
                "date": t["date"],
                "action": t["action"],
                "price": float(t["price"]),
                **({"pnl": float(t["pnl"])} if "pnl" in t else {})
            } for t in trades
        ]
    }
