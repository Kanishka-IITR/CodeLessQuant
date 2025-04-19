import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const EquityChart = ({ equityData }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={equityData}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis  domain={['dataMin', 'dataMax']}
  tickFormatter={(value) => value.toFixed(2)} />
      <Tooltip 
       formatter={(value) => [`$${value.toFixed(2)}`, 'Equity']}
       labelFormatter={(label) => `Date: ${label}`}/>
      <Line type="monotone" dataKey="equity" stroke="#8884d8" strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default EquityChart;


// import {
//   ComposedChart, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Bar
// } from 'recharts';

// const renderCustomCandle = (props) => {
//   const { x, y, width, height, payload,yHigh,yLow } = props;
//   // Basic validation
//   if (
//     [x, y, width, height, yHigh, yLow].some(
//       (val) => val === undefined || val === null || isNaN(val)
//     )
//   ) {
//     return null; // Don't render broken candle
//   }
//   const isUp = payload.close >= payload.open;
//   const color = isUp ? '#4caf50' : '#f44336';
//   const candleY = isUp ? y : y + height;
//   const candleHeight = Math.abs(height);

//   return (
//     <g>
//       {/* Wick (high to low) */}
//       <line x1={x + width / 2} x2={x + width / 2} y1={yHigh} y2={yLow} stroke={color} />
//       {/* Candle body */}
//       <rect
//         x={x}
//         y={candleY}
//         width={width}
//         height={candleHeight}
//         fill={color}
//       />
//     </g>
//   );
// };

// const EquityChart = ({ equityData }) => {
//   // Calculate extra coordinates for custom candles
//   const formattedData = equityData.map(item => ({
//     ...item,
//     yHigh: Math.min(item.open, item.close) - (item.high - Math.max(item.open, item.close)),
//     yLow: Math.max(item.open, item.close) + (Math.min(item.open, item.close) - item.low),
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <ComposedChart data={formattedData}>
//         <CartesianGrid stroke="#ccc" />
//         <XAxis dataKey="date" />
//         <YAxis
//           domain={['dataMin', 'dataMax']}
//           tickFormatter={(value) => value.toFixed(2)}
//         />
//         <Tooltip
//           formatter={(value, name) => {
//             if (typeof value === 'number') return [`$${value.toFixed(2)}`, name];
//             return [value, name];
//           }}
//           labelFormatter={(label) => `Date: ${label}`}
//         />
//         <LineChart/>

//         {/* Line chart for equity */}
//         <Line
//           type="monotone"
//           dataKey="equity"
//           stroke="#8884d8"
//           strokeWidth={2}
//           dot={false}
//         />

//         {/* Candlestick chart */}
//         <Bar
//           dataKey="open"
//           barSize={6}
//           shape={renderCustomCandle}
//         />
//       </ComposedChart>
//     </ResponsiveContainer>
//   );
// };

// export default EquityChart;

