import React from 'react';

function MetricsTable({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Performance Summary</h3>
      <table border="1" cellPadding="10">
        <tbody>
          <tr><td>Starting Balance</td><td>${metrics.starting_balance}</td></tr>
          <tr><td>Final Balance</td><td>${metrics.final_balance}</td></tr>
          <tr><td>Total Trades</td><td>{metrics.total_trades}</td></tr>
          <tr><td>Sharpe Ratio</td><td>{metrics.sharpe_ratio}</td></tr>
          <tr><td>Win Rate</td><td>{metrics.win_rate}%</td></tr>
          <tr><td>Average Win</td><td>{metrics.avg_win}</td></tr>
          <tr><td>Average Loss</td><td>{metrics.avg_loss}</td></tr>
          <tr><td>Max Drawdown</td><td>{metrics.max_drawdown}%</td></tr>
          <tr><td>avg_profit_per_trade</td><td>{metrics.avg_profit_per_trade}%</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default MetricsTable;