// import React, { useState } from 'react';
// import axios from 'axios';

// const LoginPage = ({ onLoginSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/login', { email, password });
//       localStorage.setItem('token', response.data.access_token);
//       onLoginSuccess(); // Redirect or show editor
//     } catch (err) {
//       alert('Login failed: ' + err.response?.data?.detail || 'Server error');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//         <input
//           type="email"
//           className="w-full mb-3 p-2 border rounded"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           className="w-full mb-3 p-2 border rounded"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import RegisterPage from './RegisterPage';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      onLoginSuccess();
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  if (showRegister) return <RegisterPage onRegisterSuccess={() => setShowRegister(false)} />;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login to AlgoBlocks</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
      <p>
        New user? <button onClick={() => setShowRegister(true)}>Register</button>
      </p>
    </div>
  );
}

export default LoginPage;

