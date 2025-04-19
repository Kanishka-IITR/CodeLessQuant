import React, { useState } from 'react';
import axios from 'axios';
import BlocklyEditor from './components/BlocklyEditor';
import MetricsTable from './components/MetricsTable';
import LivePriceViewer from './components/LivePriceViewer';
import EquityChart from './components/EquityChart';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [codeJson, setCodeJson] = useState('');
  const [formData, setFormData] = useState({
    stockSymbol: '',
    startDate: '',
    endDate: '',
    initialBalance: 10000,
    stopLoss: '',
    takeProfit: '',
    trailingStop: '',
    selectedTicker: 'AAPL',
  });

  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [equityCurve, setEquityCurve] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBacktest = async () => {
    const { stockSymbol, startDate, endDate, initialBalance, stopLoss, takeProfit, trailingStop } = formData;

    if (!stockSymbol || !startDate || !endDate || !codeJson || !initialBalance) {
      alert("Please fill in all fields including balance.");
      return;
    }

    try {
      const payload = {
        symbol: stockSymbol.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim(),
        initial_balance: parseFloat(initialBalance),
        code: typeof codeJson === 'string' ? JSON.parse(codeJson) : codeJson,
        stop_loss: stopLoss ? parseFloat(stopLoss) : null,
        take_profit: takeProfit ? parseFloat(takeProfit) : null,
        trailing_stop: trailingStop ? parseFloat(trailingStop) : null,
      };

      const response = await axios.post('http://localhost:8000/api/backtest', payload);

      const {
        final_balance,
        starting_balance,
        sharpe_ratio,
        total_trades,
        win_rate,
        avg_win,
        avg_loss,
        max_drawdown,
        avg_profit_per_trade,
        equity_curve,
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
        avg_profit_per_trade,
      });

      setResult(response.data);
      setEquityCurve(equity_curve || []);
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
    <div className="app-container">
      {/* NAVBAR */}
      <header className="navbar">
        <h1 className="brand">🧠 CodeLessQuant</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* FORM GRID */}
      <section className="form-grid">
        {[
          { label: "Stock Symbol", name: "stockSymbol", placeholder: "e.g. AAPL" },
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
          { label: "Initial Balance", name: "initialBalance", type: "number" },
          { label: "Stop Loss (%)", name: "stopLoss", type: "number", placeholder: "e.g. 2" },
          { label: "Take Profit (%)", name: "takeProfit", type: "number", placeholder: "e.g. 5" },
          { label: "Trailing Stop (%)", name: "trailingStop", type: "number", placeholder: "e.g. 1.5" },
          { label: "Live Ticker", name: "selectedTicker", placeholder: "e.g. AAPL, MSFT" }
        ].map(({ label, name, type = "text", placeholder }) => (
          <div className="input-card" key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
            />
          </div>
        ))}
      </section>

      {/* BLOCKLY EDITOR */}
      <div className="blockly-container">
        <BlocklyEditor onCodeChange={setCodeJson} />
      </div>

      {/* BACKTEST BUTTON */}
      <div className="backtest-btn-wrapper">
        <button className="backtest-btn" onClick={handleBacktest}>🚀 Start Backtest</button>
      </div>

      {/* LIVE PRICE */}
      <LivePriceViewer ticker={formData.selectedTicker} />

      {/* RESULTS */}
      {result && (
        <div className="results-section">
          <h2>📊 Backtest Result</h2>
          {metrics && <MetricsTable metrics={metrics} />}
          <EquityChart equityData={equityCurve} />
          <pre className="result-json">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;