


# import pandas as pd
# from .data_fetcher import get_data, fetch_and_save_data

# def calculate_rsi(df, period=14):
#     delta = df['Close'].diff()
#     gain = delta.where(delta > 0, 0)
#     loss = -delta.where(delta < 0, 0)
#     avg_gain = gain.rolling(window=period).mean()
#     avg_loss = loss.rolling(window=period).mean()
#     rs = avg_gain / avg_loss
#     df['RSI'] = 100 - (100 / (1 + rs))
#     return df

# def calculate_ema(df, period=20):
#     df[f'EMA_{period}'] = df['Close'].ewm(span=period, adjust=False).mean()
#     return df

# def calculate_macd(df, fast=12, slow=26, signal=9):
#     exp1 = df['Close'].ewm(span=fast, adjust=False).mean()
#     exp2 = df['Close'].ewm(span=slow, adjust=False).mean()
#     macd = exp1 - exp2
#     signal_line = macd.ewm(span=signal, adjust=False).mean()
#     df['MACD'] = macd - signal_line
#     return df

# def calculate_bollinger(df, period=20):
#     sma = df['Close'].rolling(window=period).mean()
#     std = df['Close'].rolling(window=period).std()
#     df['Bollinger_Upper'] = sma + (2 * std)
#     df['Bollinger_Lower'] = sma - (2 * std)
#     return df

# def calculate_atr(df, period=14):
#     high_low = df['High'] - df['Low']
#     high_close = abs(df['High'] - df['Close'].shift())
#     low_close = abs(df['Low'] - df['Close'].shift())
#     tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
#     df['ATR'] = tr.rolling(window=period).mean()
#     return df

# def evaluate_condition(row, condition):
#     if condition["type"] != "LOGIC_COMPARE":
#         return False

#     op = condition.get("operator")
#     left = condition.get("left", {})
#     right = condition.get("right")
#     typ = left.get("type")
#     period = left.get("period", 14)

#     if typ == "RSI":
#         value = row.get("RSI")
#     elif typ == "SMA":
#         value = row.get("SMA")
#     elif typ == "EMA":
#         value = row.get(f"EMA_{period}")
#     elif typ == "MACD":
#         value = row.get("MACD")
#     elif typ == "BOLLINGER":
#         band = left.get("band", "upper").upper()
#         value = row.get("Bollinger_Upper" if band == "UPPER" else "Bollinger_Lower")
#     elif typ == "ATR":
#         value = row.get("ATR")
#     else:
#         return False

#     if pd.isna(value):
#         return False

#     if isinstance(right, dict):
#         r_typ = right.get("type")
#         r_period = right.get("period", 14)
#         if r_typ == "RSI":
#             right_val = row.get("RSI")
#         elif r_typ == "SMA":
#             right_val = row.get("SMA")
#         elif r_typ == "EMA":
#             right_val = row.get(f"EMA_{r_period}")
#         elif r_typ == "MACD":
#             right_val = row.get("MACD")
#         elif r_typ == "ATR":
#             right_val = row.get("ATR")
#         else:
#             right_val = None
#     else:
#         right_val = right

#     if op == "GT":
#         return value > right_val
#     elif op == "GTE":
#         return value >= right_val
#     elif op == "LT":
#         return value < right_val
#     elif op == "LTE":
#         return value <= right_val
#     elif op == "EQ":
#         return value == right_val

#     return False

# def process_rule(row, rule):
#     if rule["type"] == "IF":
#         condition = rule.get("condition")
#         if evaluate_condition(row, condition):
#             return process_rule(row, rule.get("do", {}))  # recurse
#     elif rule["type"] == "BUY":
#         return "BUY"
#     elif rule["type"] == "SELL":
#         return "SELL"
#     return None

# def run_backtest(symbol, start_date, end_date, strategy_json, initial_balance):
#     fetch_and_save_data(symbol, start_date, end_date)
#     df = get_data(symbol, start_date, end_date)

#     if "Date" not in df.columns:
#         raise ValueError("'Date' column not found in the data")

#     df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
#     df["High"] = pd.to_numeric(df["High"], errors="coerce")
#     df["Low"] = pd.to_numeric(df["Low"], errors="coerce")
#     df.dropna(subset=["Close", "High", "Low"], inplace=True)
#     df["Date"] = pd.to_datetime(df["Date"])
#     df.set_index("Date", inplace=True)

#     # Precompute all required indicators
#     for rule in strategy_json:
#         def collect_indicators(r):
#             if r["type"] == "IF":
#                 cond = r["condition"]
#                 left = cond.get("left", {})
#                 typ = left.get("type")
#                 period = left.get("period", 14)

#                 if typ == "RSI":
#                     calculate_rsi(df, period)
#                 elif typ == "SMA":
#                     df["SMA"] = df["Close"].rolling(window=period).mean()
#                 elif typ == "EMA":
#                     calculate_ema(df, period)
#                 elif typ == "MACD":
#                     calculate_macd(df)
#                 elif typ == "BOLLINGER":
#                     calculate_bollinger(df, period)
#                 elif typ == "ATR":
#                     calculate_atr(df, period)

#                 return collect_indicators(r["do"])
#         collect_indicators(rule)

#     balance = initial_balance
#     position = None
#     entry_price = 0
#     trades = []

#     for i in range(len(df)):
#         row = df.iloc[i]
#         date = row.name
#         close = row["Close"]

#         for rule in strategy_json:
#             signal = process_rule(row, rule)

#             if signal == "BUY" and position is None:
#                 entry_price = close
#                 position = close
#                 trades.append({
#                     "date": str(date.date()),
#                     "action": "BUY",
#                     "price": round(close, 2)
#                 })

#             elif signal == "SELL" and position is not None:
#                 profit = close - entry_price
#                 balance += profit
#                 trades.append({
#                     "date": str(date.date()),
#                     "action": "SELL",
#                     "price": round(close, 2),
#                     "pnl": round(profit, 2)
#                 })
#                 position = None

#     final_balance = round(balance, 2)
#     returns = df["Close"].pct_change().dropna()
#     sharpe = (returns.mean() / returns.std()) * (252 ** 0.5) if returns.std() else 0

#     return {
#         "final_balance": float(final_balance),
#         "starting_balance": float(initial_balance),
#         "total_trades": len(trades),
#         "sharpe_ratio": round(sharpe, 2),
#         "trades": [
#             {
#                 "date": t["date"],
#                 "action": t["action"],
#                 "price": float(t["price"]),
#                 **({"pnl": float(t["pnl"])} if "pnl" in t else {})
#             } for t in trades
#         ]
#     }
import pandas as pd
from .data_fetcher import get_data, fetch_and_save_data

# === Indicator Calculations ===

def calculate_rsi(df, period=14):
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    df['RSI'] = 100 - (100 / (1 + rs))
    return df

def calculate_sma(df, period=20):
    df["SMA"] = df["Close"].rolling(window=period).mean()
    return df

def calculate_ema(df, period=20):
    df[f'EMA_{period}'] = df['Close'].ewm(span=period, adjust=False).mean()
    return df

def calculate_macd(df, fast=12, slow=26, signal=9):
    exp1 = df['Close'].ewm(span=fast, adjust=False).mean()
    exp2 = df['Close'].ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    df['MACD'] = macd - signal_line
    return df

def calculate_bollinger(df, period=20):
    sma = df['Close'].rolling(window=period).mean()
    std = df['Close'].rolling(window=period).std()
    df['Bollinger_Upper'] = sma + (2 * std)
    df['Bollinger_Lower'] = sma - (2 * std)
    return df

def calculate_atr(df, period=14):
    high_low = df['High'] - df['Low']
    high_close = abs(df['High'] - df['Close'].shift())
    low_close = abs(df['Low'] - df['Close'].shift())
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    df['ATR'] = tr.rolling(window=period).mean()
    return df

# === Condition Evaluation ===

def evaluate_condition(row, condition):
    if condition["type"] != "LOGIC_COMPARE":
        return False

    op = condition.get("operator")
    left = condition.get("left", {})
    right = condition.get("right")
    typ = left.get("type")
    period = left.get("period", 14)

    # Extract left-side value
    if typ == "RSI":
        value = row.get("RSI")
    elif typ == "SMA":
        value = row.get("SMA")
    elif typ == "EMA":
        value = row.get(f"EMA_{period}")
    elif typ == "MACD":
        value = row.get("MACD")
    elif typ == "BOLLINGER":
        band = left.get("band", "upper").upper()
        value = row.get("Bollinger_Upper" if band == "UPPER" else "Bollinger_Lower")
    elif typ == "ATR":
        value = row.get("ATR")
    else:
        return False

    if pd.isna(value):
        return False

    # Extract right-side value
    if isinstance(right, dict):
        r_typ = right.get("type")
        r_period = right.get("period", 14)
        if r_typ == "RSI":
            right_val = row.get("RSI")
        elif r_typ == "SMA":
            right_val = row.get("SMA")
        elif r_typ == "EMA":
            right_val = row.get(f"EMA_{r_period}")
        elif r_typ == "MACD":
            right_val = row.get("MACD")
        elif r_typ == "ATR":
            right_val = row.get("ATR")
        else:
            right_val = None
    else:
        right_val = right

    if right_val is None or pd.isna(right_val):
        return False

    if op == "GT":
        return value > right_val
    elif op == "GTE":
        return value >= right_val
    elif op == "LT":
        return value < right_val
    elif op == "LTE":
        return value <= right_val
    elif op == "EQ":
        return value == right_val

    return False

# === Strategy Rule Processing ===

def process_rule(row, rule):
    if rule["type"] == "IF":
        condition = rule.get("condition")
        if evaluate_condition(row, condition):
            return process_rule(row, rule.get("do", {}))
    elif rule["type"] == "BUY":
        return "BUY"
    elif rule["type"] == "SELL":
        return "SELL"
    return None

# === Backtest Engine ===

def run_backtest(symbol, start_date, end_date, strategy_json, initial_balance):
    fetch_and_save_data(symbol, start_date, end_date)
    df = get_data(symbol, start_date, end_date)

    df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
    df["High"] = pd.to_numeric(df["High"], errors="coerce")
    df["Low"] = pd.to_numeric(df["Low"], errors="coerce")
    df.dropna(subset=["Close", "High", "Low"], inplace=True)

    df["Date"] = pd.to_datetime(df["Date"])
    df.set_index("Date", inplace=True)

    # Precompute indicators
    for rule in strategy_json:
        def collect_indicators(r):
            if r["type"] == "IF":
                cond = r["condition"]
                left = cond.get("left", {})
                typ = left.get("type")
                period = left.get("period", 14)

                if typ == "RSI":
                    calculate_rsi(df, period)
                elif typ == "SMA":
                    calculate_sma(df, period)
                elif typ == "EMA":
                    calculate_ema(df, period)
                elif typ == "MACD":
                    calculate_macd(df)
                elif typ == "BOLLINGER":
                    calculate_bollinger(df, period)
                elif typ == "ATR":
                    calculate_atr(df, period)

                collect_indicators(r.get("do", {}))
        collect_indicators(rule)

    balance = initial_balance
    position = None
    entry_price = 0
    trades = []

    for i in range(len(df)):
        row = df.iloc[i]
        date = row.name
        close = row["Close"]

        for rule in strategy_json:
            signal = process_rule(row, rule)

            if signal == "BUY" and position is None:
                entry_price = close
                position = close
                trades.append({
                    "date": str(date.date()),
                    "action": "BUY",
                    "price": round(close, 2)
                })

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

    final_balance = round(balance, 2)
    returns = df["Close"].pct_change().dropna()
    sharpe = (returns.mean() / returns.std()) * (252 ** 0.5) if returns.std() else 0

    return {
        "final_balance": float(final_balance),
        "starting_balance": float(initial_balance),
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
