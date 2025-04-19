// import React, { useState } from 'react';
// import axios from 'axios';

// const RegisterPage = ({ onRegisterSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:8000/register', { email, password });
//       alert('Registration successful! You can now log in.');
//       onRegisterSuccess(); // Redirect to login
//     } catch (err) {
//       alert('Registration failed: ' + err.response?.data?.detail || 'Server error');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
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
//         <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/auth/register', { email, password });
      alert('Registration successful! You can now log in.');
      onRegisterSuccess();
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register for AlgoBlocks</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already registered? <button onClick={onRegisterSuccess}>Go to Login</button>
      </p>
    </div>
  );
}

export default RegisterPage;
