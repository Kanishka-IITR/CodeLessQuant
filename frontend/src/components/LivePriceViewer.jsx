

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const LivePriceViewer = ({ ticker }) => {
//   const [priceData, setPriceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!ticker) return;

//     const fetchPrice = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`http://localhost:8000/live-price/${ticker}`);
//         setPriceData(res.data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching price:', err);
//         setError('Failed to fetch price');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrice();
//     const interval = setInterval(fetchPrice, 5000);
//     return () => clearInterval(interval);
//   }, [ticker]);

//   return (
//     <div className="p-4 border rounded-xl shadow-md w-fit bg-white">
//       <h2 className="text-xl font-semibold mb-2">Live Price: {ticker || "—"}</h2>
      
//       {loading ? (
//         <p>Loading price...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : priceData ? (
//         <div className="space-y-1">
//           <p><strong>Ask:</strong> ${priceData.ask_price}</p>
//           <p><strong>Bid:</strong> ${priceData.bid_price}</p>
//           <p><strong>Time:</strong> {new Date(priceData.timestamp).toLocaleTimeString()}</p>
//         </div>
//       ) : (
//         <p>No data available</p>
//       )}
//     </div>
//   );
// };

// export default LivePriceViewer;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LivePriceViewer = ({ ticker }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null); // New state to track the fetch time

  useEffect(() => {
    if (!ticker) return;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/live-price/${ticker}`);
        setPriceData(res.data);
        setFetchTime(new Date().toLocaleTimeString()); // Update fetch time on every new data fetch
        setError(null);
      } catch (err) {
        console.error('Error fetching price:', err);
        setError('Failed to fetch price');
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [ticker]);

  return (
    <div className="p-4 border rounded-xl shadow-md w-fit bg-white">
      <h2 className="text-xl font-semibold mb-2">Live Price: {ticker || "—"}</h2>
      
      {loading ? (
        <p>Loading price...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : priceData ? (
        <div className="space-y-1">
          <p><strong>Ask:</strong> ${priceData.ask_price}</p>
          <p><strong>Bid:</strong> ${priceData.bid_price}</p>
          <p><strong>Last Updated:</strong> {fetchTime}</p> {/* Show the updated fetch time */}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default LivePriceViewer;

