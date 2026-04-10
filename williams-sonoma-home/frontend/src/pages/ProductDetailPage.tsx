import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { useCartStore } from '../context/store';
import { catalogProducts } from '../data/products';
import api from '../services/api';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Review {
  review_id: string;
  rating: number;
  review_text: string;
  review_title?: string;
  full_name: string;
  review_date: string;
  verified_purchase?: boolean;
  sentiment_score?: number;
}

interface Insights {
  buyersLikeYou?: { name: string; initials: string; matchPercentage: number; context: string; rating: number; excerpt: string }[];
  returnReasons?: string[];
  returnReasonSummary?: { reason: string; count: number }[];
  highlights?: { pros?: string[]; cons?: string[]; aiSummary?: string[] };
  suggestedRewrite?: string;
  productStats?: {
    returnCount: number;
    avgDaysToReturn: number | null;
    topReturnReason: string | null;
    avgShippingDays: number | null;
    ratingDistribution: Record<number, number>;  // { 5: N, 4: N, ... }
    freeShipping: boolean;
  };
  careTips?: string[];   // model-derived, not hardcoded
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const StarRow: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const sizes = { sm: '14px', md: '18px', lg: '24px' };
  return (
    <span style={{ fontSize: sizes[size], letterSpacing: '2px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= Math.round(rating) ? '#c9a96e' : '#d1ccc5' }}>★</span>
      ))}
    </span>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export const ProductDetailPage: React.FC = () => {
  const { skuId } = useParams<{ skuId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'insights'>('overview');
  const [showRewrite, setShowRewrite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const load = async () => {
      // Find product in local data
      const found = catalogProducts.find((p) => p.skuId === skuId);
      if (found) {
        setProduct(found);

        // Fetch reviews from backend
        try {
          const reviewsRes = await api.getSimilarReviews(skuId!);
          if (reviewsRes.data?.reviews) setReviews(reviewsRes.data.reviews);
        } catch {
          // Backend may not be running — silently ignore
        }

        // Fetch ML insights from backend
        try {
          const insightsRes = await api.getProductInsights(skuId!);
          setInsights(insightsRes.data);
        } catch {
          // Silently ignore
        }
      }
      setLoading(false);
    };
    load();
  }, [skuId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ skuId: product.skuId, name: product.name, price: product.price, quantity, imageUrl: product.imageUrl });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <Loading />;
  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-body)' }}>
        <p style={{ fontSize: '18px', color: '#6b6558' }}>Product not found</p>
        <button onClick={() => navigate('/catalog')} style={{ padding: '12px 28px', background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer', letterSpacing: '2px', fontSize: '12px' }}>
          BACK TO CATALOG
        </button>
      </div>
    );
  }

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : product.rating;
  const ratingCount = reviews.length || product.ratingCount;

  return (
    <>
      <Header />
      <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── Breadcrumb ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px 0', fontSize: '11px', letterSpacing: '2px', color: '#9a9086', textTransform: 'uppercase' }}>
          <Link to="/catalog" style={{ color: '#9a9086', textDecoration: 'none' }} className="breadcrumb-link">Catalog</Link>
          {' / '}
          <Link to={`/catalog?category=${product.category}`} style={{ color: '#9a9086', textDecoration: 'none' }} className="breadcrumb-link">{product.category}</Link>
          {' / '}
          <span style={{ color: '#1a1a1a' }}>{product.name}</span>
        </div>

        {/* ── Hero: Image + Info ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

          {/* Left: Image */}
          <div>
            <div style={{ background: '#ece9e3', aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/600x600/ece9e3/9a9086?text=${encodeURIComponent(product.subCategory)}`; }}
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span style={{ background: '#1a1a1a', color: '#fff', padding: '4px 12px', fontSize: '10px', letterSpacing: '2px' }}>{product.brand.toUpperCase()}</span>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ aspectRatio: '1', background: '#ece9e3', overflow: 'hidden', cursor: 'pointer', opacity: i === 1 ? 1 : 0.6, border: i === 1 ? '2px solid #1a1a1a' : '2px solid transparent', transition: 'all 0.2s' }}>
                  <img src={product.imageUrl} alt={`View ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/200x200/ece9e3/9a9086?text=View+${i}`; }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div style={{ position: 'sticky', top: '24px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#9a9086', textTransform: 'uppercase', marginBottom: '8px' }}>{product.subCategory}</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 400, lineHeight: 1.2, marginBottom: '16px', color: '#1a1a1a' }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <StarRow rating={avgRating} size="md" />
              <span style={{ fontSize: '13px', color: '#6b6558' }}>{avgRating.toFixed(1)} ({ratingCount} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '24px' }}>
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p style={{ color: '#6b6558', lineHeight: 1.8, marginBottom: '28px', fontSize: '14px' }}>{product.description}</p>

            {/* Color & Style badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {product.style.split(' | ').map((s: string) => (
                <span key={s} style={{ padding: '4px 12px', border: '1px solid #d1ccc5', fontSize: '11px', letterSpacing: '1px', color: '#6b6558', textTransform: 'uppercase' }}>{s}</span>
              ))}
              {product.color.split(' | ').map((c: string) => (
                <span key={c} style={{ padding: '4px 12px', background: '#ece9e3', fontSize: '11px', letterSpacing: '1px', color: '#6b6558', textTransform: 'uppercase' }}>{c}</span>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', border: '1px solid #d1ccc5', alignItems: 'center' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '48px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#1a1a1a' }}>−</button>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '14px' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '48px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#1a1a1a' }}>+</button>
              </div>
              <button
                onClick={handleAddToCart}
                style={{ flex: 1, height: '48px', background: addedToCart ? '#4a7c59' : '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', transition: 'background 0.3s' }}
              >
                {addedToCart ? '✓ ADDED TO CART' : 'ADD TO CART'}
              </button>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {product.tags.map((tag: string) => (
                <span key={tag} style={{ padding: '3px 10px', background: '#f0ede8', fontSize: '11px', color: '#9a9086', borderRadius: '2px' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ borderBottom: '1px solid #d1ccc5', display: 'flex', gap: '0' }}>
            {(['overview', 'reviews', 'insights'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 28px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #1a1a1a' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: activeTab === tab ? '#1a1a1a' : '#9a9086',
                  fontWeight: activeTab === tab ? 600 : 400,
                  marginBottom: '-1px',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'overview' ? 'Specifications' : tab === 'reviews' ? `Reviews (${ratingCount})` : '✨ AI Insights'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px 80px' }}>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div style={{ background: '#fff', border: '1px solid #e8e4de', padding: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, marginBottom: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>Specifications</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    {[
                      ['Material', product.material],
                      ['Color', product.color],
                      ['Style', product.style],
                      ['Dimensions', product.dimensions],
                      ['Weight', product.weight],
                      ['Category', `${product.category} › ${product.subCategory}`],
                      ['SKU', product.skuId],
                    ].map(([label, value]) => (
                      <tr key={label} style={{ borderBottom: '1px solid #f0ede8' }}>
                        <td style={{ padding: '12px 0', fontWeight: 600, color: '#9a9086', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', width: '40%' }}>{label}</td>
                        <td style={{ padding: '12px 0', color: '#1a1a1a' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Rating breakdown — from real DB distribution when available */}
                <div style={{ background: '#fff', border: '1px solid #e8e4de', padding: '32px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, marginBottom: '20px', letterSpacing: '2px', textTransform: 'uppercase' }}>Rating Overview</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontFamily: 'var(--font-heading)', color: '#1a1a1a', lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
                      <StarRow rating={avgRating} size="sm" />
                      <div style={{ fontSize: '11px', color: '#9a9086', marginTop: '4px' }}>{ratingCount} reviews</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5, 4, 3, 2, 1].map((star) => {
                        // Prefer real distribution from insights API; fall back to estimate
                        const dist = insights?.productStats?.ratingDistribution;
                        const total = dist
                          ? Object.values(dist).reduce((s: number, n: number) => s + n, 0)
                          : ratingCount;
                        const count = dist
                          ? (dist[star] ?? 0)
                          : Math.round(ratingCount * [0.6, 0.25, 0.1, 0.03, 0.02][5 - star]);
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        return (
                          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#9a9086', width: '12px' }}>{star}</span>
                            <span style={{ color: '#c9a96e', fontSize: '12px' }}>★</span>
                            <div style={{ flex: 1, height: '6px', background: '#f0ede8', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#c9a96e', borderRadius: '3px', transition: 'width 0.5s' }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#9a9086', width: '28px' }}>{count > 0 ? count : `${Math.round(pct)}%`}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Care & Delivery — model-driven */}
                <div style={{ background: '#f5f2ed', border: '1px solid #e8e4de', padding: '24px' }}>
                  <h4 style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', color: '#6b6558' }}>Care & Delivery Insights</h4>
                  {insights?.careTips && insights.careTips.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#6b6558', lineHeight: 2 }}>
                      {insights.careTips.map((tip, i) => (
                        <li key={i}>→ {tip}</li>
                      ))}
                      {insights.productStats?.freeShipping && (
                        <li>→ Free shipping on this item (over $500)</li>
                      )}
                    </ul>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#6b6558', lineHeight: 2 }}>
                      {insights?.productStats?.avgShippingDays ? (
                        <li>→ Average shipping: {insights.productStats.avgShippingDays} days</li>
                      ) : (
                        <li>→ Shipping time varies by location</li>
                      )}
                      {insights?.productStats?.returnCount != null && insights.productStats.returnCount > 0 ? (
                        <li>→ {insights.productStats.returnCount} customers returned this item</li>
                      ) : (
                        <li>→ 30-day return window available</li>
                      )}
                      {insights?.productStats?.topReturnReason && (
                        <li>→ Common return: {insights.productStats.topReturnReason}</li>
                      )}
                      <li>→ Check dimensions carefully before ordering</li>
                      <li>→ Color may vary slightly from photos</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9a9086' }}>
                  <p style={{ fontSize: '16px' }}>No reviews yet for this product.</p>
                  <p style={{ fontSize: '13px', marginTop: '8px' }}>Be the first to share your experience!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((review) => (
                    <div key={review.review_id} style={{ background: '#fff', border: '1px solid #e8e4de', padding: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <StarRow rating={review.rating} size="sm" />
                            {review.review_title && (
                              <span style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>{review.review_title}</span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#9a9086', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span>{review.full_name}</span>
                            {review.verified_purchase && (
                              <span style={{ background: '#e8f2ec', color: '#2d6a4f', padding: '2px 8px', fontSize: '10px', letterSpacing: '1px' }}>VERIFIED</span>
                            )}
                            <span>{formatDate(review.review_date)}</span>
                          </div>
                        </div>
                        {review.sentiment_score !== undefined && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: '#9a9086', letterSpacing: '1px', marginBottom: '2px' }}>SENTIMENT</div>
                            <div style={{ width: '60px', height: '4px', background: '#f0ede8', borderRadius: '2px' }}>
                              <div style={{ width: `${(review.sentiment_score + 1) * 50}%`, height: '100%', background: review.sentiment_score > 0 ? '#4a7c59' : '#c0392b', borderRadius: '2px' }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b6558', lineHeight: 1.8 }}>{review.review_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

              {/* No insights fallback */}
              {!insights ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9a9086', background: '#fff', border: '1px solid #e8e4de' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                  <p style={{ fontSize: '14px' }}>AI insights will appear here once the backend analysis is complete.</p>
                  <p style={{ fontSize: '12px', marginTop: '8px', color: '#b0a99e' }}>Connect the backend to enable ML-powered insights.</p>
                </div>
              ) : (
                <>
                  {/* Buyers Like You */}
                  {insights.buyersLikeYou && insights.buyersLikeYou.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', color: '#9a9086' }}>Personalised Reviews</h4>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 400, marginBottom: '8px', color: '#1a1a1a', letterSpacing: '-0.5px' }}>Buyers like you</h2>
                      <div style={{ fontSize: '13px', color: '#9a9086', marginBottom: '24px' }}>
                        Matched on: {insights.buyersLikeYou[0].context}
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {insights.buyersLikeYou.map((buyer, idx) => {
                          const matchedTagsContext = buyer.context.split(' · ').map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' · ');
                          return (
                            <div key={idx} style={{ background: '#fff', border: '1px solid #e8e4de', padding: '24px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f5f2ed', color: '#6b6558', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: '14px', flexShrink: 0 }}>{buyer.initials}</div>
                                <div>
                                  <div style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a1a', marginBottom: '2px' }}>{buyer.name}</div>
                                  <div style={{ fontSize: '12px', color: '#9a9086', marginBottom: '4px', lineHeight: 1.4 }}>{matchedTagsContext}</div>
                                  <div style={{ fontSize: '12px', color: '#6b6558', marginBottom: '4px' }}>Matched {buyer.matchPercentage}%</div>
                                  <StarRow rating={buyer.rating} size="sm" />
                                </div>
                              </div>
                              <p style={{ fontSize: '14px', color: '#4a4640', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{buyer.excerpt}"</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Return Reason Summary */}
                    <div style={{ background: '#fff', border: '1px solid #e8e4de', padding: '32px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9a9086', margin: 0 }}>Return Reason Summary</h4>
                        <span style={{ fontSize: '10px', background: '#f5f2ed', padding: '4px 8px', borderRadius: '4px', color: '#6b6558', letterSpacing: '1px' }}>NLP</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {insights.returnReasonSummary && insights.returnReasonSummary.length > 0 ? (
                          (() => {
                            const totalReturns = insights.returnReasonSummary.reduce((sum, r) => sum + r.count, 0);
                            return insights.returnReasonSummary.slice(0, 4).map((item, i) => {
                              const percentage = Math.round((item.count / totalReturns) * 100);
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                  <div style={{ width: '120px', fontSize: '13px', color: '#4a4640', paddingRight: '16px' }}>{item.reason}</div>
                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <div style={{ height: '8px', width: '100%', background: '#e8e4de', display: 'flex' }}>
                                      <div style={{ height: '100%', width: `${percentage}%`, background: percentage > 40 ? '#d32f2f' : '#a68a64' }} />
                                    </div>
                                  </div>
                                  <div style={{ width: '40px', textAlign: 'right', fontSize: '13px', color: '#1a1a1a' }}>{percentage}%</div>
                                </div>
                              );
                            });
                          })()
                        ) : (
                          <div style={{ fontSize: '13px', color: '#9a9086' }}>Not enough return data yet.</div>
                        )}
                      </div>
                      
                      {insights.returnReasonSummary && insights.returnReasonSummary.length > 0 && (
                        <div style={{ marginTop: '32px', fontSize: '12px', color: '#9a9086' }}>
                          Based on {insights.productStats?.returnCount || 0} returns · {insights.returnReasonSummary[0]?.count || 0} shared same primary reason
                        </div>
                      )}
                    </div>

                    {/* Review Highlights */}
                    <div style={{ background: '#fff', border: '1px solid #e8e4de', padding: '32px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9a9086', marginBottom: '24px', margin: 0 }}>Review Highlights</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {insights.highlights?.aiSummaryPara ? (
                          <div style={{ fontSize: '15px', color: '#4a4640', lineHeight: 1.8, fontStyle: 'italic', position: 'relative', paddingLeft: '24px' }}>
                            <span style={{ position: 'absolute', left: 0, top: 0, fontSize: '24px', color: '#e8e4de', fontFamily: 'serif', lineHeight: 1 }}>"</span>
                            {insights.highlights.aiSummaryPara}
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', color: '#9a9086' }}>Synthesizing review highlights...</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI-Enhanced Description */}
                  {insights.suggestedRewrite && (
                    <div style={{ background: '#fff', border: '1px solid #e8e4de', padding: '32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>✨ AI-Enhanced Description</h3>
                      <div style={{ overflow: 'hidden', maxHeight: showRewrite ? '400px' : '80px', transition: 'max-height 0.4s ease' }}>
                        <p style={{ fontSize: '14px', color: '#6b6558', lineHeight: 1.9 }}>{insights.suggestedRewrite}</p>
                      </div>
                      <button
                        onClick={() => setShowRewrite(!showRewrite)}
                        style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9a9086', fontWeight: 600 }}
                      >
                        {showRewrite ? 'SHOW LESS ↑' : 'SHOW MORE ↓'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style>{`
        .breadcrumb-link:hover { color: #1a1a1a !important; }
      `}</style>
    </>
  );
};
