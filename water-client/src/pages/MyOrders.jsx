import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyOrders = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/user', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(res => setOrders(res.data))
      .catch(() => alert('Failed to load orders'));
  }, [auth.token]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded shadow-sm bg-white">
            <p className="mb-2 text-gray-700">
              <strong>Delivery Date:</strong>{' '}
              {new Date(order.deliveryDate).toLocaleDateString()}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Payment Status:</strong>{' '}
              <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}>
                {order.paymentStatus}
              </span>
            </p>
            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.productId?.name} — {item.quantity} unit(s)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
