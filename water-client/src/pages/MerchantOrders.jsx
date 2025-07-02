import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MerchantOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:5000/api/orders/merchant', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => alert('Failed to load merchant orders'));
  }, [token]); // ✅ added 'token' to dependency array

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">📋 Orders for Your Products</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o._id} className="border p-4 rounded">
              <p><strong>Customer:</strong> {o.userId?.email}</p>
              <p><strong>Address:</strong> {o.deliveryAddress}, {o.locality}</p>
              <p><strong>Delivery Date:</strong> {new Date(o.deliveryDate).toLocaleDateString()}</p>
              <ul className="mt-2 text-sm">
                {o.products.map((p, i) => (
                  <li key={i}>Product ID: {p.productId} × {p.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MerchantOrders;
