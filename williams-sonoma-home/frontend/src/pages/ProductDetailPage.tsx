import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { useCartStore } from '../context/store';
import { catalogProducts } from '../data/products';
import api from '../services/api';

export const ProductDetailPage: React.FC = () => {
  const { skuId } = useParams<{ skuId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showRewrite, setShowRewrite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      // Find product from local data
      const foundProduct = catalogProducts.find(p => p.skuId === skuId);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Fetch ML insights from backend
        try {
          const insightsRes = await api.getProductInsights(skuId!);
          setInsights(insightsRes.data);
        } catch (error) {
          console.log('Insights not available:', error);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [skuId]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        skuId: product.skuId,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      });
      alert('Added to cart!');
    }
  };

  if (loading) return <Loading />;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm uppercase tracking-wider mb-12 text-secondary">
          <a href="/catalog" className="hover:text-primary transition">
            CATALOG
          </a>
          {' / '}
          <a href={`/catalog?category=${product.category}`} className="hover:text-primary transition">
            {product.category}
          </a>
          {' / '}
          <span className="text-primary">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Product Image & Gallery */}
          <div>
            <div className="bg-gray-100 aspect-square mb-6 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 cursor-pointer border border-gray-300">
                  <img
                    src={product.imageUrl}
                    alt={`View ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-xs uppercase tracking-wide text-secondary mb-2">{product.brand}</p>
            <h1 className="font-serif text-4xl mb-6">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-serif text-3xl text-secondary">${product.price.toFixed(2)}</span>
              <div className="flex items-center">
                <span className="text-amber-500">{'★'.repeat(Math.floor(product.rating))}</span>
                <span className="text-gray-300">{'★'.repeat(5 - Math.floor(product.rating))}</span>
                <span className="ml-2 text-sm">({product.ratingCount} reviews)</span>
              </div>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Specifications */}
            <div className="mb-8 bg-background p-6 border border-gray-200">
              <h3 className="font-serif text-lg mb-4 uppercase">SPECIFICATIONS</h3>

              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="font-semibold py-2 text-secondary uppercase">Material</td>
                    <td className="py-2">{product.specifications.material}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="font-semibold py-2 text-secondary uppercase">Color</td>
                    <td className="py-2">{product.specifications.color}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="font-semibold py-2 text-secondary uppercase">Finish</td>
                    <td className="py-2">{product.specifications.finish}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="font-semibold py-2 text-secondary uppercase">Dimensions</td>
                    <td className="py-2">{product.specifications.dimensions}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="font-semibold py-2 text-secondary uppercase">Weight</td>
                    <td className="py-2">{product.specifications.weight}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2 text-secondary uppercase">Style</td>
                    <td className="py-2">{product.specifications.style}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-background transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-l border-r border-gray-300 py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-background transition"
                >
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn flex-1 text-sm">
                ADD TO CART
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string, idx: number) => (
                <span key={idx} className="tag">
                  {typeof tag === 'string' ? tag : (tag as any).label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights Panel - From ML Models */}
        {insights && (
          <div className="border-t border-gray-300 pt-20">
            {/* Similar Customers Section - From User Embeddings */}
            <div className="mb-16">
              <h2 className="font-serif text-3xl mb-8">BUYERS LIKE YOU</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.buyersLikeYou?.map((buyer: any, idx: number) => (
                  <div key={idx} className="p-6 bg-background border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {buyer.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{buyer.matchPercentage}% match</p>
                        <p className="text-xs text-gray-600">{buyer.context}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(buyer.rating)].map((_, i) => (
                        <span key={i} className="text-secondary">★</span>
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed text-gray-700">"{buyer.excerpt}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Reasons Section - From priority_actions.json */}
            {insights.returnReasons && insights.returnReasons.length > 0 && (
              <div className="mb-16">
                <h3 className="font-serif text-2xl mb-6">WHAT CUSTOMERS RETURNED THIS FOR</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-background border border-gray-200">
                    <h4 className="font-semibold mb-4 text-secondary">Common Reasons</h4>
                    <ul className="space-y-2">
                      {insights.returnReasons.slice(0, 5).map((reason: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="text-secondary font-bold mt-0.5">→</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-blue-50 border border-blue-200">
                    <h4 className="font-semibold mb-4 text-blue-900">⚠️ Key Considerations</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-blue-900">• Check dimensions carefully before ordering</li>
                      <li className="text-sm text-blue-900">• Review material care instructions</li>
                      <li className="text-sm text-blue-900">• Color may vary slightly from photos</li>
                      <li className="text-sm text-blue-900">• Delivery timeline varies by location</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Product Highlights - From sku_summaries.json */}
            {insights.highlights && (
              <div className="mb-16">
                <h3 className="font-serif text-2xl mb-6">WHAT CUSTOMERS LOVED</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.highlights.pros && insights.highlights.pros.length > 0 && (
                    <div className="p-6 bg-green-50 border border-green-200">
                      <h4 className="font-semibold mb-4 text-green-900">✓ Pros</h4>
                      <ul className="space-y-2">
                        {insights.highlights.pros.map((pro: string, idx: number) => (
                          <li key={idx} className="text-sm text-green-900 flex items-start gap-2">
                            <span className="font-bold">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insights.highlights.cons && insights.highlights.cons.length > 0 && (
                    <div className="p-6 bg-orange-50 border border-orange-200">
                      <h4 className="font-semibold mb-4 text-orange-900">⚠ Cons</h4>
                      <ul className="space-y-2">
                        {insights.highlights.cons.map((con: string, idx: number) => (
                          <li key={idx} className="text-sm text-orange-900 flex items-start gap-2">
                            <span>•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Suggested Description - From manufacturer models */}
            {insights.suggestedRewrite && (
              <div className="bg-background p-8 border border-gray-200">
                <h3 className="font-serif text-lg uppercase mb-4">✨ AI-ENHANCED DESCRIPTION</h3>

                <div
                  className={`p-4 bg-white border border-gray-300 mb-4 transition-all ${
                    showRewrite ? 'max-h-96 overflow-y-auto' : 'max-h-24 overflow-hidden'
                  }`}
                >
                  <p className="text-sm leading-relaxed text-gray-700">{insights.suggestedRewrite}</p>
                </div>

                <button
                  onClick={() => setShowRewrite(!showRewrite)}
                  className="text-sm uppercase tracking-wider text-secondary font-semibold hover:text-primary transition"
                >
                  {showRewrite ? 'SHOW LESS' : 'SHOW MORE'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
