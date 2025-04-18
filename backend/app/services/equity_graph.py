import matplotlib.pyplot as plt
import pandas as pd

def plot_equity_curve(equity_data):
    # Convert the equity data to a DataFrame
    df = pd.DataFrame(equity_data)
    df['date'] = pd.to_datetime(df['date'])
    # Check lengths
    if len(df['date']) != len(df['balance']):
        print(f"Mismatch in lengths: {len(df['date'])} dates vs {len(df['balance'])} balances")
        # Adjust lengths if necessary
    # Plot the equity curve
    plt.figure(figsize=(10, 6))
    plt.plot(df['date'], df['balance'], label="Equity Curve")
    plt.title('Equity Curve Over Time')
    plt.xlabel('Date')
    plt.ylabel('Balance')
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.show()

# Optionally save the plot to a file
def save_equity_curve(equity_data, filename="equity_curve.png"):
    df = pd.DataFrame(equity_data)
    df['date'] = pd.to_datetime(df['date'])
    
    plt.figure(figsize=(10, 6))
    plt.plot(df['date'], df['balance'], label="Equity Curve")
    plt.title('Equity Curve Over Time')
    plt.xlabel('Date')
    plt.ylabel('Balance')
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig(filename)
