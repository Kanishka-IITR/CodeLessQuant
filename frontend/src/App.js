import React, { useState } from 'react';
import BlocklyEditor from './components/BlocklyEditor';
import axios from 'axios';

function App() {
  const [codeJson, setCodeJson] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [initialBalance, setInitialBalance] = useState(10000); // ✅ New state
  const [result, setResult] = useState(null);

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
        initial_balance: parseFloat(initialBalance), // ✅ Send balance
        code: parsedCode,
      };
      console.log("🔄 Parsed codeJson:", parsedCode);
      console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post('http://localhost:8000/api/backtest', payload);
      console.log("✅ Backtest success:", response.data);
      setResult(response.data);
    } catch (error) {
      console.error('❌ Backtest failed:', error);
      setResult({ error: error.response?.data || "Network or parsing error." });
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>AlgoBlocks 🔥</h1>

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
      </div>

      <BlocklyEditor onCodeChange={setCodeJson} />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleBacktest}>Start Backtest</button>
      </div>

      {result && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <strong>📊 Backtest Result:</strong><br />
          {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
        </div>
      )}
    </div>
  );
}

export default App;