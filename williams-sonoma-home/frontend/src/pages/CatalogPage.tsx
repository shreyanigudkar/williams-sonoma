import React, { useEffect, useState, useMemo } from 'react';
import { Header, Footer, Loading } from '../components/Layout';
import { ProductCard } from '../components/ProductComponents';
import { useNavigate } from 'react-router-dom';
import { catalogProducts, Product } from '../data/products';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: 'All',
    search: '',
    sort: 'featured',
    limit: 20,
    offset: 0,
  });

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(catalogProducts.map(p => p.subCategory))];
    return cats;
  }, []);

  // Filter and sort products
  const filterSortProducts = useMemo(() => {
    let filtered = catalogProducts;

    // Filter by category
    if (filters.category !== 'All') {
      filtered = filtered.filter(p => p.subCategory === filters.category);
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Sort
    let sorted = [...filtered];
    if (filters.sort === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [filters.category, filters.search, filters.sort]);

  // Paginate
  const paginatedProducts = useMemo(() => {
    return filterSortProducts.slice(
      filters.offset,
      filters.offset + filters.limit
    );
  }, [filterSortProducts, filters.offset, filters.limit]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value, offset: 0 });
  };

  if (loading) return <Loading />;

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-5xl mb-4">DESIGNER FURNITURE</h1>
          <p className="text-xl opacity-90">
            Curated collection of luxury furnishings for the modern home
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="px-4 py-3 border border-gray-300 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
          >
            <option value="featured">FEATURED</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
            <option value="rating">HIGHEST RATED</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-gray-300">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat)}
              className={`px-4 py-2 uppercase text-xs tracking-wider transition font-semibold ${
                filters.category === cat
                  ? 'bg-secondary text-white'
                  : 'bg-white border border-secondary text-secondary hover:bg-secondary hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.skuId}
              product={product}
              onClick={() => navigate(`/product/${product.skuId}`)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 py-8 border-t border-gray-300">
          <button
            onClick={() => handleFilterChange('offset', Math.max(0, filters.offset - filters.limit))}
            disabled={filters.offset === 0}
            className="btn disabled:opacity-50 disabled:cursor-not-allowed py-2 px-6 text-xs"
          >
            PREVIOUS
          </button>

          <span className="py-2 text-secondary font-serif">
            Page {Math.floor(filters.offset / filters.limit) + 1} of {Math.ceil(filterSortProducts.length / filters.limit)}
          </span>

          <button
            onClick={() => handleFilterChange('offset', filters.offset + filters.limit)}
            disabled={filters.offset + filters.limit >= filterSortProducts.length}
            className="btn disabled:opacity-50 disabled:cursor-not-allowed py-2 px-6 text-xs"
          >
            NEXT
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};
