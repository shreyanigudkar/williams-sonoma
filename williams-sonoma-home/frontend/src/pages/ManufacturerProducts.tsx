import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { useAuthStore } from '../context/store';
import api from '../services/api';

interface Product {
  skuId: string;
  name: string;
  category: string;
  price: number;
  returnRate: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export const ManufacturerProducts: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'manufacturer') {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await api.getManufacturerProducts();
        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate]);

  const filteredProducts = filterRisk === 'all' 
    ? products 
    : products.filter(p => p.riskLevel === filterRisk);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-[#C62828] text-white';
      case 'high':
        return 'bg-[#F57C00] text-white';
      case 'medium':
        return 'bg-[#FBC02D] text-black';
      default:
        return 'bg-green-500 text-white';
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-8">PRODUCT MANAGEMENT</h1>

        {/* Risk Filter */}
        <div className="flex gap-3 mb-8 pb-6 border-b border-gray-300">
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-4 py-2 uppercase text-xs tracking-wider transition font-semibold ${
              filterRisk === 'all'
                ? 'bg-primary text-white'
                : 'bg-white border border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            ALL ({products.length})
          </button>

          <button
            onClick={() => setFilterRisk('critical')}
            className={`px-4 py-2 uppercase text-xs tracking-wider transition font-semibold ${
              filterRisk === 'critical'
                ? 'bg-[#C62828] text-white'
                : 'bg-white border border-[#C62828] text-[#C62828] hover:bg-[#C62828] hover:text-white'
            }`}
          >
            CRITICAL ({products.filter(p => p.riskLevel === 'critical').length})
          </button>

          <button
            onClick={() => setFilterRisk('high')}
            className={`px-4 py-2 uppercase text-xs tracking-wider transition font-semibold ${
              filterRisk === 'high'
                ? 'bg-[#F57C00] text-white'
                : 'bg-white border border-[#F57C00] text-[#F57C00] hover:bg-[#F57C00] hover:text-white'
            }`}
          >
            HIGH ({products.filter(p => p.riskLevel === 'high').length})
          </button>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full text-sm">
              <thead className="bg-background border-b border-gray-300">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-secondary uppercase">
                    PRODUCT NAME
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-secondary uppercase">
                    CATEGORY
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-secondary uppercase">
                    PRICE
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-secondary uppercase">
                    RETURN RATE
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-secondary uppercase">
                    RISK LEVEL
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-secondary uppercase">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.skuId}
                    className="border-b border-gray-200 hover:bg-background transition"
                  >
                    <td className="py-4 px-6 font-medium">{product.name}</td>
                    <td className="py-4 px-6 text-gray-700">{product.category}</td>
                    <td className="py-4 px-6 font-semibold text-secondary">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 h-2">
                          <div
                            className="bg-secondary h-2"
                            style={{
                              width: `${Math.min(product.returnRate * 10, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {product.returnRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase ${getRiskColor(product.riskLevel)}`}>
                        {product.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => navigate(`/manufacturer/product/${product.skuId}`)}
                        className="text-secondary hover:text-primary text-xs uppercase tracking-wider font-semibold transition"
                      >
                        REVIEW →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
