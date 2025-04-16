

import React, { useState } from 'react';
import BlocklyEditor from './components/BlocklyEditor';
import axios from 'axios';

function App() {
  const [codeJson, setCodeJson] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');

  const handleBacktest = async () => {
    if (!stockSymbol || !startDate || !endDate || !codeJson) {
      alert("Please fill in stock symbol, dates, and strategy blocks.");
      return;
    }

    try {
      const parsedCode = typeof codeJson === 'string' ? JSON.parse(codeJson) : codeJson;

      const payload = {
        symbol: stockSymbol.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim(),
        code: parsedCode,
      };

      console.log("🔄 Parsed codeJson:", parsedCode);
      console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post('http://localhost:8000/api/backtest', payload);
      console.log("✅ Backtest success:", response.data);
      alert("✅ Backtest complete:\n" + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('❌ Backtest failed:', error);
      if (error.response) {
        console.log("🧾 Response error data:", error.response.data);
        alert("❌ " + JSON.stringify(error.response.data, null, 2));
      } else {
        alert("❌ Network or JSON parse error.");
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>AlgoBlocks 🔥</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Stock Symbol: </label>
        <input value={stockSymbol} onChange={e => setStockSymbol(e.target.value)} placeholder="AAPL" />
        <br />
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <br />
        <label>End Date: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <BlocklyEditor onCodeChange={setCodeJson} />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleBacktest}>Start Backtest</button>
      </div>

      <pre><strong>Generated Code:</strong><br />{codeJson}</pre>
    </div>
  );
}

export default App;
