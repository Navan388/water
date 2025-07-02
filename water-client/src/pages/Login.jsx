import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      login(user, token); // ✅ updates context

      // ✅ Navigate by role
      if (user.role === 'merchant') {
        navigate('/merchant/dashboard');
      } else if (user.role === 'delivery') {
        navigate('/delivery/dashboard');
      } else {
        navigate('/order');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🔐 Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn w-full">
          Login
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        New here? <Link to="/register" className="text-blue-600">Register now</Link>
      </p>
    </div>
  );
};

export default Login;
