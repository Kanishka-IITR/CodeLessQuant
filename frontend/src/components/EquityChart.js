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


