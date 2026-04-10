import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';
import api from '../services/api';
import { Header, Footer } from '../components/Layout';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(formData.email, formData.password, formData.role);
      const { token, user } = response.data;

      login(user, token);

      // Redirect based on role
      if (user.role === 'customer') {
        navigate('/catalog');
      } else if (user.role === 'manufacturer') {
        navigate('/manufacturer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-12 border border-gray-300">
            <h1 className="font-serif text-3xl mb-2 text-center">LOGIN</h1>
            <p className="text-center text-gray-600 text-sm mb-8">Access your Williams Sonoma Home account</p>

            {error && <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm border border-red-200">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wide font-semibold mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="customer">Customer</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wide font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm uppercase tracking-wide font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full text-sm disabled:opacity-50"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              Don't have an account?{' '}
              <a href="/signup" className="text-secondary font-semibold hover:text-primary transition">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
