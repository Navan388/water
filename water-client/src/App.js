import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import OrderNow from './pages/OrderNow'; // user
import MerchantDashboard from './pages/MerchantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/order" element={<PrivateRoute><OrderNow /></PrivateRoute>} />
          <Route path="/merchant/dashboard" element={<PrivateRoute><MerchantDashboard /></PrivateRoute>} />
          <Route path="/delivery/dashboard" element={<PrivateRoute><DeliveryDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
