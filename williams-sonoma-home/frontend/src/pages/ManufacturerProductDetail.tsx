import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { useAuthStore } from '../context/store';
import api from '../services/api';

interface ProductDetail {
  skuId: string;
  productName: string;
  gapScore: number;
  originalDescription: string;
  suggestedRewrite: string;
  missingAttributes: string[];
  painPoints: string[];
  urgencyScore: number;
  revenueAtRisk: number;
}

export const ManufacturerProductDetail: React.FC = () => {
  const { skuId } = useParams<{ skuId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'manufacturer') {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        if (!skuId) return;
        const response = await api.getProductDetail(skuId);
        setProduct(response.data);
        setNewDescription(response.data.suggestedRewrite || response.data.originalDescription);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [skuId, user, navigate]);

  const handleSaveDescription = async () => {
    if (!skuId) return;

    setSaving(true);
    try {
      await api.updateDescription(skuId, newDescription);
      if (product) {
        setProduct({ ...product, originalDescription: newDescription });
      }
      setEditMode(false);
      alert('Description updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update description');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  const getRiskLevel = (score: number) => {
    if (score > 700000) return { level: 'critical', color: 'text-[#C62828]', bg: 'bg-red-50' };
    if (score > 400000) return { level: 'high', color: 'text-[#F57C00]', bg: 'bg-orange-50' };
    return { level: 'medium', color: 'text-[#FBC02D]', bg: 'bg-yellow-50' };
  };

  const riskLevel = getRiskLevel(product.urgencyScore);

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/manufacturer/products" className="text-secondary hover:text-primary text-xs uppercase tracking-wider font-semibold">
            ← BACK TO PRODUCTS
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl mb-4">{product.productName}</h1>

            {/* Risk Alert */}
            <div className={`${riskLevel.bg} border-l-4 ${riskLevel.color} border-l-[${riskLevel.color}] p-4 mb-8`}>
              <p className={`font-semibold mb-1 ${riskLevel.color}`}>
                {riskLevel.level.toUpperCase()} PRIORITY
              </p>
              <p className="text-sm text-gray-700">
                Revenue at risk: <span className="font-semibold">${product.revenueAtRisk.toFixed(2)}</span>
              </p>
            </div>

            {/* Pain Points */}
            <div className="mb-12 bg-background p-6 border border-gray-300">
              <h3 className="font-serif text-lg uppercase mb-4">CUSTOMER PAIN POINTS</h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.painPoints.map((point, idx) => (
                  <span
                    key={idx}
                    className="bg-red-100 text-red-700 px-3 py-1 text-xs uppercase font-semibold"
                  >
                    {point}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-700">
                <p className="mb-2">Customers frequently mention these issues:</p>
                <ul className="list-disc list-inside space-y-1">
                  {product.painPoints.map((point, idx) => (
                    <li key={idx} className="capitalize">{point} complaints</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Attributes */}
            {product.missingAttributes.length > 0 && (
              <div className="mb-12 bg-blue-50 border border-blue-200 p-6">
                <h3 className="font-serif text-lg uppercase mb-4 text-blue-900">⚠️ MISSING ATTRIBUTES</h3>

                <p className="text-sm text-blue-800 mb-4">
                  Add these details to improve your product listing:
                </p>

                <div className="space-y-2">
                  {product.missingAttributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-blue-900">
                      <span className="font-bold">•</span>
                      <span>{attr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="mb-12">
              <h3 className="font-serif text-lg uppercase mb-4">PRODUCT DESCRIPTION</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="bg-white border border-gray-300 p-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wide mb-3">CURRENT DESCRIPTION</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {product.originalDescription}
                  </p>
                  <p className="text-xs text-gray-500">Clarity Score: 45%</p>
                </div>

                {/* Suggested */}
                <div className="bg-green-50 border border-green-300 p-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wide mb-3 text-green-900">
                    ✓ AI SUGGESTED
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {product.suggestedRewrite}
                  </p>
                  <p className="text-xs text-green-700 font-semibold">Clarity Score: 89%</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditMode(!editMode);
                  setNewDescription(product.suggestedRewrite || product.originalDescription);
                }}
                className="mt-6 text-secondary hover:text-primary text-xs uppercase tracking-wider font-semibold"
              >
                {editMode ? 'CANCEL' : 'EDIT DESCRIPTION'}
              </button>
            </div>

            {/* Edit Mode */}
            {editMode && (
              <div className="mb-12 bg-background p-6 border border-gray-300">
                <h4 className="font-serif text-lg uppercase mb-4">EDIT DESCRIPTION</h4>

                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
                  rows={8}
                />

                <div className="flex gap-4">
                  <button
                    onClick={handleSaveDescription}
                    disabled={saving}
                    className="btn text-xs py-2 px-6 disabled:opacity-50"
                  >
                    {saving ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 border border-gray-300 bg-white text-primary uppercase text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Metrics */}
          <div>
            <div className="bg-white border border-gray-300 p-6 sticky top-6">
              <h3 className="font-serif text-lg uppercase mb-6">METRICS</h3>

              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
                    Gap Score
                  </p>
                  <p className="font-serif text-3xl text-primary mb-1">{product.gapScore}%</p>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-secondary h-2"
                      style={{ width: `${product.gapScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center border-t border-gray-300 pt-6">
                  <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
                    Urgency Score
                  </p>
                  <p className={`font-serif text-2xl ${riskLevel.color}`}>
                    {product.urgencyScore.toLocaleString()}
                  </p>
                </div>

                <div className="text-center border-t border-gray-300 pt-6">
                  <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
                    Revenue at Risk
                  </p>
                  <p className="font-serif text-2xl text-[#C62828]">
                    ${product.revenueAtRisk.toFixed(0)}
                  </p>
                </div>

                <div className="border-t border-gray-300 pt-6">
                  <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-3">
                    Action Items
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span>Update product photos</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-amber-600 font-bold mt-0.5">→</span>
                      <span>Clarify material details</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-amber-600 font-bold mt-0.5">→</span>
                      <span>Add weight/dimensions</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn w-full mt-6 text-xs py-2">
                MARK AS RESOLVED
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
