import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Checkout from './Checkout';

const OrderNow = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  }, []);

  const addToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: prev[productId] ? prev[productId] + 1 : 1,
    }));
  };

  const removeFromCart = (productId) => {
    const updated = { ...cart };
    delete updated[productId];
    setCart(updated);
  };

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p._id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">🛒 User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600">
              💧 {product.quantityInLiters} Liters
            </p>
            <p className="text-sm text-gray-500">
              👤 Sold by: {product.createdBy?.email || 'Merchant'}
            </p>
            <p className="mt-2 font-bold text-blue-600">₹{product.price}</p>
            <button
              className="btn mt-3 w-full"
              onClick={() => addToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h3 className="text-2xl font-bold mb-3">🧾 Your Cart</h3>
        {Object.keys(cart).length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <ul className="mb-4 space-y-2">
              {Object.entries(cart).map(([id, qty]) => {
                const product = products.find((p) => p._id === id);
                return (
                  <li key={id} className="flex justify-between items-center">
                    <span>
                      {product?.name} ({product?.quantityInLiters}L) × {qty} = ₹
                      {product?.price * qty}
                    </span>
                    <button
                      onClick={() => removeFromCart(id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Total */}
            <div className="text-right font-semibold text-lg">
              Total: ₹{totalPrice}
            </div>
          </>
        )}
      </div>

      {/* Checkout */}
      {Object.keys(cart).length > 0 && (
        <Checkout cart={cart} products={products} totalPrice={totalPrice} />
      )}
    </div>
  );
};

export default OrderNow;
