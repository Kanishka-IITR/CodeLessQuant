
import React, { useState } from 'react';
import BlocklyEditor from './components/BlocklyEditor';
import axios from 'axios';
import MetricsTable from './components/MetricsTable';
import LivePriceViewer from './components/LivePriceViewer';
import EquityChart from './components/EquityChart';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [codeJson, setCodeJson] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('AAPL');

  const [initialBalance, setInitialBalance] = useState(10000);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [trailingStop, setTrailingStop] = useState('');
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);
  const [results, setResults] = useState(null);

  const handleBacktest = async () => {
    if (!stockSymbol || !startDate || !endDate || !codeJson || !initialBalance) {
      alert("Please fill in all fields including balance.");
      return;
    }

    try {
      const parsedCode = typeof codeJson === 'string' ? JSON.parse(codeJson) : codeJson;

      const payload = {
        symbol: stockSymbol.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim(),
        initial_balance: parseFloat(initialBalance),
        code: parsedCode,
        stop_loss: stopLoss !== '' ? parseFloat(stopLoss) : null,
        take_profit: takeProfit !== '' ? parseFloat(takeProfit) : null,
        trailing_stop: trailingStop !== '' ? parseFloat(trailingStop) : null,
      };

      console.log(" Sending payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post('http://localhost:8000/api/backtest', payload);
      console.log("Backtest success:", response.data);

      setResult(response.data);
      setEquityCurve(response.data.equity_curve);
      console.log("Equity Curve Sample:", response.data.equity_curve.slice(0, 10));

      const {
        final_balance,
        starting_balance,
        sharpe_ratio,
        total_trades,
        win_rate,
        avg_win,
        avg_loss,
        max_drawdown,
        avg_profit_per_trade //  added here
      } = response.data;

      setMetrics({
        final_balance,
        starting_balance,
        sharpe_ratio,
        total_trades,
        win_rate,
        avg_win,
        avg_loss,
        max_drawdown,
        avg_profit_per_trade // added here
      });

    } catch (error) {
      console.error('Backtest failed:', error);
      setResult({ error: error.response?.data || "Network or parsing error." });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginPage onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CodeLessQuant </h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Stock Symbol: </label>
        <input value={stockSymbol} onChange={e => setStockSymbol(e.target.value)} placeholder="e.g. AAPL" />
        <br />
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <br />
        <label>End Date: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <br />
        <label>Initial Balance: </label>
        <input type="number" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} />
        <br />
        <label>Stop Loss (%): </label>
        <input type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="e.g. 2" />
        <br />
        <label>Take Profit (%): </label>
        <input type="number" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="e.g. 5" />
        <br />
        <label>Trailing Stop (%): </label>
        <input type="number" value={trailingStop} onChange={e => setTrailingStop(e.target.value)} placeholder="e.g. 1.5" />
        <br />
        <label>Enter Ticker for Live Price:</label>
        <input 
          type="text" 
          value={selectedTicker} 
          onChange={e => setSelectedTicker(e.target.value)} 
          placeholder="e.g. AAPL, MSFT" 
        />
      </div>

      <BlocklyEditor onCodeChange={setCodeJson} />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleBacktest}>Start Backtest</button>
      </div>

      <LivePriceViewer ticker={selectedTicker} />

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <strong>Backtest Result:</strong>

          {result.final_balance && (
            <div style={{ marginTop: '1rem' }}>
              <MetricsTable metrics={{
                final_balance: result.final_balance,
                starting_balance: result.starting_balance,
                total_trades: result.total_trades,
                sharpe_ratio: result.sharpe_ratio,
                win_rate: result.win_rate,
                avg_win: result.avg_win,
                avg_loss: result.avg_loss,
                max_drawdown: result.max_drawdown,
                avg_profit_per_trade: result.avg_profit_per_trade
              }} />
            </div>
          )}
          <EquityChart equityData={equityCurve} />
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;

