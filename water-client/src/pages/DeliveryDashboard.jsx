import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeliveryDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">🚚 Delivery Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Delivery information section */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-2">📦 Assigned Deliveries</h2>
        <p className="text-gray-600">You will see assigned orders to deliver here.</p>
        {/* Future: Add list of orders, update delivery status, etc. */}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
