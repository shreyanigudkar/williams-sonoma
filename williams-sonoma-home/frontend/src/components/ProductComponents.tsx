import React from 'react';
import { Product, BuyerInsight, ProductInsight } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="product-card cursor-pointer" onClick={onClick}>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-64 object-cover mb-4 bg-gray-100"
      />

      <p className="text-xs uppercase text-secondary tracking-wide mb-2">{product.brand}</p>
      <h3 className="font-serif text-lg mb-2">{product.name}</h3>

      <div className="flex justify-between items-center mb-4">
        <span className="font-serif text-lg text-secondary">${product.price.toFixed(2)}</span>
        <div className="flex items-center">
          <span className="text-amber-500">★</span>
          <span className="ml-1 text-xs">
            {product.rating} ({product.ratingCount})
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

interface BuyerCardProps {
  buyer: BuyerInsight;
}

export const BuyerCard: React.FC<BuyerCardProps> = ({ buyer }) => {
  return (
    <div className="insight-card border border-gray-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="buyer-avatar">{buyer.initials}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-primary text-white px-2 py-1 rounded-none">
              {buyer.matchPercentage}% MATCH
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{buyer.context}</p>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <span className="text-amber-500">{'★'.repeat(buyer.rating)}</span>
        <span className="text-gray-400">{'★'.repeat(5 - buyer.rating)}</span>
      </div>

      <p className="text-sm text-gray-700">{buyer.excerpt}</p>
    </div>
  );
};

interface ReturnReasonProps {
  reasons: string[];
}

export const ReturnReasonSummary: React.FC<ReturnReasonProps> = ({ reasons }) => {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="insight-card">
        <h4 className="font-serif text-sm uppercase tracking-wide mb-4">Return Reasons</h4>
        <p className="text-sm text-gray-600">No returns reported for this product</p>
      </div>
    );
  }

  return (
    <div className="insight-card">
      <h4 className="font-serif text-sm uppercase tracking-wide mb-4">Common Return Reasons</h4>

      <div className="space-y-3">
        {reasons.slice(0, 5).map((reason, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-700 capitalize">{reason}</p>
            </div>
            <div className="w-16 bg-gray-200 h-2 rounded-none">
              <div
                className="bg-secondary h-2"
                style={{ width: `${Math.random() * 80}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface HighlightsProps {
  highlights: { pros: string[]; cons: string[] };
}

export const ReviewHighlights: React.FC<HighlightsProps> = ({ highlights }) => {
  return (
    <div className="insight-card grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-serif text-sm uppercase tracking-wide mb-3">Pros</h4>
        <ul className="space-y-2">
          {highlights.pros.map((pro, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span className="capitalize">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-sm uppercase tracking-wide mb-3">Cons</h4>
        <ul className="space-y-2">
          {highlights.cons.map((con, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5">✗</span>
              <span className="capitalize">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface AlertCardProps {
  level: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const AlertCard: React.FC<AlertCardProps> = ({ level, title, description, action }) => {
  const getLevelClass = () => {
    switch (level) {
      case 'critical':
        return 'alert-critical';
      case 'high':
        return 'alert-high';
      case 'medium':
        return 'alert-medium';
      default:
        return 'alert-card';
    }
  };

  return (
    <div className={`alert-card ${getLevelClass()}`}>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      {action && (
        <button onClick={action.onClick} className="text-xs font-semibold text-primary hover:underline">
          {action.label} →
        </button>
      )}
    </div>
  );
};
