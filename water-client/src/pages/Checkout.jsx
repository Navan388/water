import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart, products }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const order = {
        products: Object.entries(cart).map(([id, qty]) => ({
          productId: id,
          quantity: qty,
        })),
        deliveryAddress: address,
        locality,
        deliveryDate,
        paymentMethod,
      };

      await axios.post('http://localhost:5000/api/orders/place', order, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('✅ Order placed successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {step === 1 && (
        <>
          <h3 className="font-semibold mb-2">🛒 Your Cart:</h3>
          <ul className="mb-4">
            {Object.entries(cart).map(([id, qty]) => {
              const product = products.find(p => p._id === id);
              return (
                <li key={id}>
                  {product?.name} x {qty} = ₹{product?.price * qty}
                </li>
              );
            })}
          </ul>
          <button className="btn" onClick={() => setStep(2)}>Next →</button>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="font-semibold mb-2">🏠 Delivery Info</h3>
          <input className="input mb-2" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
          <input className="input mb-2" placeholder="Locality" value={locality} onChange={e => setLocality(e.target.value)} required />
          <input className="input mb-4" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required />
          <div className="flex justify-between">
            <button className="btn" onClick={() => setStep(1)}>← Back</button>
            <button className="btn" onClick={() => setStep(3)}>Next →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="font-semibold mb-2">💳 Payment</h3>
          <select className="input mb-4" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Cash On Delivery</option>
            <option>Online</option>
          </select>
          <div className="flex justify-between">
            <button className="btn" onClick={() => setStep(2)}>← Back</button>
            <button className="btn" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
