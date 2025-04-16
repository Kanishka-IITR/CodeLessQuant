# import pandas as pd
# from pathlib import Path

# def run_backtest(strategy_json):
#     # 📁 Resolve path to sample_data.csv
#     data_path = Path(__file__).resolve().parent.parent / "data" / "sample_data.csv"

#     # 📊 Load CSV
#     df = pd.read_csv(data_path)

#     # ✅ Ensure 'Close' column is numeric
#     df["Close"] = pd.to_numeric(df["Close"], errors="coerce")

#     # Drop rows with NaN Close (just in case)
#     df.dropna(subset=["Close"], inplace=True)

#     # 🧮 Apply Moving Average if strategy has it
#     if "moving_average" in strategy_json:
#         period = strategy_json["moving_average"]["period"]
#         df["MA"] = df["Close"].rolling(window=period).mean()
#     else:
#         df["MA"] = 0  # Default if not used

#     # ⚙️ Apply BUY/SELL signal based on strategy conditions
#     df["Signal"] = 0
#     df.loc[df["Close"] > df["MA"], "Signal"] = 1  # BUY
#     df.loc[df["Close"] < df["MA"], "Signal"] = -1 # SELL

#     # 💹 Simulate trades
#     trades = df[df["Signal"] != 0]
#     pnl = (trades["Close"].diff() * trades["Signal"].shift()).dropna()
#     total_pnl = pnl.sum()

#     # 📈 Calculate metrics
#     result = {
#     "total_pnl": round(float(total_pnl), 2),
#     "num_trades": int(len(trades)),
#     "win_rate": f"{(pnl > 0).mean() * 100:.2f}%" if not pnl.empty else "0.00%",
#     "sharpe": round(float(pnl.mean() / pnl.std()), 2) if pnl.std() and not pnl.empty else 0
# }


#     return result

# # ✅ Test the backtester with dummy strategy
# if __name__ == "__main__":
#     from pprint import pprint

#     strategy_json = {
#         "moving_average": {
#             "type": "SMA",
#             "period": 20
#         },
#         "conditions": [
#             {"if": "close > MA", "action": "BUY"},
#             {"if": "close < MA", "action": "SELL"}
#         ]
#     }

#     pprint(run_backtest(strategy_json))



# import pandas as pd
# from pathlib import Path

# # 📈 RSI calculation function
# def calculate_rsi(df, period=14):
#     delta = df['Close'].diff()
#     gain = delta.where(delta > 0, 0)
#     loss = -delta.where(delta < 0, 0)
#     avg_gain = gain.rolling(window=period).mean()
#     avg_loss = loss.rolling(window=period).mean()
#     rs = avg_gain / avg_loss
#     df['RSI'] = 100 - (100 / (1 + rs))
#     return df

# # 🚀 Main backtesting function
# def run_backtest(strategy_json):
#     # ✅ Read CSV while skipping garbage rows and setting correct headers
#     data_path = Path(__file__).resolve().parent.parent / "data" / "sample_data.csv"
#     columns = ["Date", "Price", "Close", "High", "Low", "Open", "Volume"]
#     df = pd.read_csv(data_path, skiprows=3, names=columns)

#     # 🛠 Parse dates & clean Close column
#     df["Date"] = pd.to_datetime(df["Date"])
#     df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
#     df.dropna(subset=["Close"], inplace=True)
#     df.set_index("Date", inplace=True)

#     # 🔧 Apply indicators based on strategy
#     if any(cond["indicator"] == "sma" for cond in strategy_json["conditions"]):
#         period = strategy_json["moving_average"]["period"]
#         df["SMA"] = df["Close"].rolling(window=period).mean()

#     if any(cond["indicator"] == "rsi" for cond in strategy_json["conditions"]):
#         df = calculate_rsi(df)

#     # 💼 Trading logic
#     balance = 10000
#     position = None
#     entry_price = 0
#     trades = []

#     for i in range(len(df)):
#         row = df.iloc[i]
#         date = row.name
#         close = row["Close"]

#         for rule in strategy_json["conditions"]:
#             signal = None

#             if rule["indicator"] == "sma":
#                 if "SMA" not in row or pd.isna(row["SMA"]):
#                     continue
#                 sma = row["SMA"]
#                 if rule["condition"] == ">" and close > sma and position is None:
#                     signal = "BUY"
#                 elif rule["condition"] == "<" and close < sma and position is not None:
#                     signal = "SELL"

#             elif rule["indicator"] == "rsi":
#                 if "RSI" not in row or pd.isna(row["RSI"]):
#                     continue
#                 rsi = row["RSI"]
#                 if rule["condition"] == "<" and rsi < rule["value"] and position is None:
#                     signal = "BUY"
#                 elif rule["condition"] == ">" and rsi > rule["value"] and position is not None:
#                     signal = "SELL"

#             if signal == "BUY":
#                 entry_price = close
#                 position = close
#                 trades.append({"date": str(date.date()), "action": "BUY", "price": round(close, 2)})

#             elif signal == "SELL":
#                 profit = close - entry_price
#                 balance += profit
#                 trades.append({
#                     "date": str(date.date()),
#                     "action": "SELL",
#                     "price": round(close, 2),
#                     "pnl": round(profit, 2)
#                 })
#                 position = None

#     # 📊 Metrics
#     final_balance = round(balance, 2)
#     pnl_list = [trade.get("pnl", 0) for trade in trades if "pnl" in trade]

#     returns = df["Close"].pct_change().dropna()
#     sharpe = (returns.mean() / returns.std()) * (252 ** 0.5) if returns.std() else 0

#     return {
#     "final_balance": float(final_balance),
#     "starting_balance": float(10000),
#     "total_trades": int(len(trades)),
#     "sharpe_ratio": float(round(sharpe, 2)),
#     "trades": [
#         {
#             "date": trade["date"],
#             "action": trade["action"],
#             "price": float(trade["price"]),
#             **({"pnl": float(trade["pnl"])} if "pnl" in trade else {})
#         } for trade in trades
#     ]
# }


# # 🧪 Test the backtester with dummy strategy
# if __name__ == "__main__":
#     from pprint import pprint

#     strategy = {
#         "moving_average": {
#             "type": "SMA",
#             "period": 20
#         },
#         "conditions": [
#             {"indicator": "sma", "condition": ">", "value": None},
#             {"indicator": "rsi", "condition": "<", "value": 30}
#         ]
#     }

#     result = run_backtest(strategy)
#     pprint(result)






# import pandas as pd
# from .logic import parse_blocks_to_logic
# from .indicators import calculate_rsi
# from datetime import datetime

# def run_backtest(blocks):
#     # Step 1: Load historical market data
#     df = pd.read_csv("app/data/sample_data.csv")
#     df['Date'] = pd.to_datetime(df['Date'])
#     df.set_index('Date', inplace=True)

#     # Step 2: Calculate indicators (currently only RSI)
#     df = calculate_rsi(df, period=14)

#     # Step 3: Convert blocks into rules
#     rules = parse_blocks_to_logic(blocks)

#     # Step 4: Initialize variables
#     balance = 10000
#     position = None
#     entry_price = 0
#     trades = []

#     # Step 5: Loop through each day in data
#     for i in range(len(df)):
#         row = df.iloc[i]
#         date = row.name

#         # Check rule match
#         for rule in rules:
#             if rule["indicator"] == "rsi":
#                 rsi = row["RSI"]
#                 condition = rule["condition"]
#                 value = rule["value"]

#                 if condition == "<" and rsi < value and position is None:
#                     position = row["Close"]
#                     entry_price = row["Close"]
#                     trades.append({"date": str(date.date()), "action": "BUY", "price": round(entry_price, 2)})
#                 elif condition == ">" and rsi > value and position is not None:
#                     exit_price = row["Close"]
#                     profit = exit_price - entry_price
#                     balance += profit
#                     trades.append({"date": str(date.date()), "action": "SELL", "price": round(exit_price, 2), "pnl": round(profit, 2)})
#                     position = None

#     # Step 6: Calculate simple performance metrics
#     final_balance = round(balance, 2)
#     total_trades = len(trades)
#     pnl_list = [trade.get("pnl", 0) for trade in trades if "pnl" in trade]

#     sharpe_ratio = calculate_sharpe(df['Close'])

#     # Step 7: Return results to frontend
#     return {
#         "final_balance": final_balance,
#         "total_trades": total_trades,
#         "trades": trades,
#         "sharpe_ratio": sharpe_ratio,
#         "starting_balance": 10000
#     }


# def calculate_sharpe(price_series, risk_free_rate=0.01):
#     returns = price_series.pct_change().dropna()
#     excess_returns = returns - (risk_free_rate / 252)
#     sharpe = (excess_returns.mean() / excess_returns.std()) * (252 ** 0.5)
#     return round(sharpe, 2)

### ✅ backtester.py (in services)
import pandas as pd
from .data_fetcher import get_data

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
