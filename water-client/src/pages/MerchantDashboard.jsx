import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MerchantDashboard = () => {
  const { logout, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', quantityInLiters: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  // ✅ useEffect loads products inline (no warning)
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => {
        const merchantProducts = res.data.filter(
          (p) => p.createdBy?._id === auth?.user?.id
        );
        setProducts(merchantProducts);
      })
      .catch(() => alert('Failed to load products'));
  }, [auth?.user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      quantityInLiters: Number(form.quantityInLiters),
      price: Number(form.price),
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, config);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/products/add', payload, config);
      }

      setForm({ name: '', quantityInLiters: '', price: '' });

      // ✅ Reload products inline
      const res = await axios.get('http://localhost:5000/api/products');
      const merchantProducts = res.data.filter(
        (p) => p.createdBy?._id === auth?.user?.id
      );
      setProducts(merchantProducts);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      quantityInLiters: product.quantityInLiters,
      price: product.price,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      // ✅ Reload after deletion
      const res = await axios.get('http://localhost:5000/api/products');
      const merchantProducts = res.data.filter(
        (p) => p.createdBy?._id === auth?.user?.id
      );
      setProducts(merchantProducts);
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">🏬 Merchant Dashboard</h1>
        <button onClick={handleLogout} className="btn bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6 space-y-3">
        <h2 className="text-xl font-semibold mb-2">{editingId ? '✏️ Edit Product' : '➕ Add Product'}</h2>
        <input type="text" name="name" placeholder="Product Name" className="input w-full" value={form.name} onChange={handleChange} />
        <input type="number" name="quantityInLiters" placeholder="Quantity (L)" className="input w-full" value={form.quantityInLiters} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" className="input w-full" value={form.price} onChange={handleChange} />
        <button type="submit" className="btn bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Products */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">🧾 Your Products</h2>
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-600">
                {product.quantityInLiters}L — ₹{product.price}
              </p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(product)} className="btn bg-yellow-400 px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="btn bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantDashboard;
