

import yfinance as yf
import pandas as pd
from pathlib import Path

def fetch_and_save_data(ticker, start, end):
    print(f"Fetching data for {ticker}...")

    data = yf.download(ticker, start=start, end=end, progress=False)

    if data.empty:
        print("No data found!")
        return

    data.reset_index(inplace=True)  # ✅ Bring 'Date' out of index so it’s saved in CSV

    data_dir = Path(__file__).resolve().parent.parent / "data"
    data_dir.mkdir(exist_ok=True)

    data_path = data_dir / "sample_data.csv"
    data.to_csv(data_path, index=False)  # ✅ Don’t save index
    print(f"✅ Data saved to: {data_path}")


# ✅ This function is used by backtester.py
def get_data(symbol, start_date, end_date):
    print(f"🔄 Reading CSV for {symbol} from sample_data.csv...")

    path = Path(__file__).resolve().parent.parent / "data" / "sample_data.csv"
    df = pd.read_csv(path)

    if "Date" not in df.columns:
        raise ValueError("⚠️ 'Date' column not found in CSV!")

    # ✅ Parse Date properly
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df = df.dropna(subset=["Date"])

    # ✅ Filter by date
    df = df[(df["Date"] >= pd.to_datetime(start_date)) & (df["Date"] <= pd.to_datetime(end_date))]

    return df


# # 🔥 Manual test
# if __name__ == "__main__":
#     fetch_and_save_data()
#     df = get_data("AAPL", "2022-01-01", "2023-01-01")
#     print(df.head())
