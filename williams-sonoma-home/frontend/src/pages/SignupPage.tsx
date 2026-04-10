import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';
import api from '../services/api';
import { Header, Footer } from '../components/Layout';

interface PreferenceOptions {
  lifestyleTags?: string[];
  preferredStyles?: string[];
  preferredColors?: string[];
  ageGroups?: string[];
  lightingConditions?: string[];
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<PreferenceOptions>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    ageGroup: '26-35',
    lifestyleTags: [] as string[],
    preferredStyles: [] as string[],
    preferredColors: [] as string[],
    lightingCondition: 'Moderate',
  });

  // Fetch preference options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.getPreferenceOptions();
        setOptions(response.data);
      } catch (err) {
        console.error('Failed to load preference options', err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...current, value] };
      } else {
        return { ...prev, [field]: current.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        ageGroup: formData.ageGroup,
        lifestyleTags: formData.lifestyleTags.join(', '),
        preferredStyles: formData.preferredStyles.join(', '),
        preferredColors: formData.preferredColors.join(', '),
        lightingCondition: formData.lightingCondition,
      });
      const { token, user } = response.data;

      login(user, token);
      navigate('/catalog');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-12 border border-gray-300">
            <h1 className="font-serif text-3xl mb-8 text-center">CREATE ACCOUNT</h1>

            {error && <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm border border-red-200">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm uppercase tracking-wide font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wide font-semibold mb-2">Email *</label>
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

                <div>
                  <label className="block text-sm uppercase tracking-wide font-semibold mb-2">Password *</label>
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

                <div>
                  <label className="block text-sm uppercase tracking-wide font-semibold mb-2">Age Group</label>
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {options.ageGroups?.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wide font-semibold mb-2">Lighting Condition</label>
                  <select
                    name="lightingCondition"
                    value={formData.lightingCondition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {options.lightingConditions?.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferences Section Header */}
              <div className="mb-6 pb-4 border-b border-gray-300">
                <h2 className="text-lg font-semibold text-primary">DESIGN PREFERENCES</h2>
                <p className="text-sm text-gray-600 mt-1">These help us personalize your experience and product recommendations</p>
              </div>

              {/* Preferred Styles */}
              <div className="mb-8">
                <label className="block text-sm uppercase tracking-wide font-semibold mb-4">Preferred Styles</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {options.preferredStyles?.map((style) => (
                    <label key={style} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferredStyles.includes(style)}
                        onChange={(e) => handleMultiSelect('preferredStyles', style, e.target.checked)}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                      />
                      <span className="ml-2 text-sm text-primary">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Colors */}
              <div className="mb-8">
                <label className="block text-sm uppercase tracking-wide font-semibold mb-4">Preferred Colors</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {options.preferredColors?.map((color) => (
                    <label key={color} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferredColors.includes(color)}
                        onChange={(e) => handleMultiSelect('preferredColors', color, e.target.checked)}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                      />
                      <span className="ml-2 text-sm text-primary">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lifestyle Tags */}
              <div className="mb-8">
                <label className="block text-sm uppercase tracking-wide font-semibold mb-4">Lifestyle & Design Tags</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {options.lifestyleTags?.map((tag) => (
                    <label key={tag} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.lifestyleTags.includes(tag)}
                        onChange={(e) => handleMultiSelect('lifestyleTags', tag, e.target.checked)}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                      />
                      <span className="ml-2 text-sm text-primary">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full text-sm disabled:opacity-50"
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-secondary font-semibold hover:text-primary transition">
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
