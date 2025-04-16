import React, { useState } from 'react';

function StrategySelector({ onSubmit }) {
  const [indicator, setIndicator] = useState('SMA');
  const [condition, setCondition] = useState('>');
  const [value, setValue] = useState(20);
  const [stock, setStock] = useState('AAPL');

  const handleSubmit = (e) => {
    e.preventDefault();

    const strategy = {
      stock,
      conditions: [
        {
          indicator: indicator.toLowerCase(),
          condition,
          value: parseFloat(value),
        },
      ],
    };

    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Build Your Strategy 🧱</h3>

      <label>Stock Symbol: </label>
      <input
        type="text"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="e.g. AAPL"
      />
      <br /><br />

      <label>Indicator: </label>
      <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>
        <option value="SMA">SMA</option>
        <option value="RSI">RSI</option>
      </select>
      <br /><br />

      <label>Condition: </label>
      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value=">">&gt;</option>
        <option value="<">&lt;</option>
      </select>
      <br /><br />

      <label>Value: </label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <br /><br />

      <button type="submit">Submit Strategy</button>
    </form>
  );
}

export default StrategySelector;