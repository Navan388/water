import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    quantityInLiters: '',
    price: '',
  });

  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post(
        'http://localhost:5000/api/products/add',
        {
          ...form,
          quantityInLiters: Number(form.quantityInLiters),
          price: Number(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('✅ Product added successfully');
      setForm({ name: '', description: '', image: '', quantityInLiters: '', price: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding product');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 mt-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="input mb-3"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          value={form.name}
          required
        />
        <input
          className="input mb-3"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={form.description}
        />
        <input
          className="input mb-3"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          value={form.image}
        />
        <input
          className="input mb-3"
          name="quantityInLiters"
          type="number"
          placeholder="Quantity (Liters)"
          onChange={handleChange}
          value={form.quantityInLiters}
          required
        />
        <input
          className="input mb-4"
          name="price"
          type="number"
          placeholder="Price (₹)"
          onChange={handleChange}
          value={form.price}
          required
        />
        <button className="btn w-full" type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
