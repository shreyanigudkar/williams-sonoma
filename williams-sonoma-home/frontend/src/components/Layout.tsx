import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../context/store';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-[#E8E4D9] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-semibold tracking-wide">
          WILLIAMS SONOMA HOME
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/catalog" className="font-sans text-sm uppercase tracking-wider hover:text-secondary transition">
            CATALOG
          </Link>

          {user?.role === 'customer' && (
            <Link to="/orders" className="font-sans text-sm uppercase tracking-wider hover:text-secondary transition">
              ORDERS
            </Link>
          )}

          {user?.role === 'manufacturer' && (
            <Link to="/manufacturer" className="font-sans text-sm uppercase tracking-wider hover:text-secondary transition">
              DASHBOARD
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="font-sans text-sm uppercase tracking-wider hover:text-secondary transition">
              ADMIN
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="btn text-xs py-2 px-4">
                LOGIN
              </Link>
              <Link to="/signup" className="btn-secondary btn text-xs py-2 px-4">
                SIGNUP
              </Link>
            </>
          ) : (
            <>
              {user.role === 'customer' && (
                <Link to="/cart" className="relative">
                  <span className="text-2xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm uppercase tracking-wider hover:text-secondary transition">
                LOGOUT
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white mt-20 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-lg mb-4">WILLIAMS SONOMA HOME</h3>
          <p className="text-sm opacity-75">Luxury furniture for the modern home.</p>
        </div>

        <div>
          <h4 className="font-serif text-sm mb-4 uppercase">SHOP</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li><a href="#" className="hover:opacity-100 transition">Furniture</a></li>
            <li><a href="#" className="hover:opacity-100 transition">Lighting</a></li>
            <li><a href="#" className="hover:opacity-100 transition">Decor</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm mb-4 uppercase">COMPANY</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li><a href="#" className="hover:opacity-100 transition">About</a></li>
            <li><a href="#" className="hover:opacity-100 transition">Contact</a></li>
            <li><a href="#" className="hover:opacity-100 transition">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm mb-4 uppercase">LEGAL</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li><a href="#" className="hover:opacity-100 transition">Privacy</a></li>
            <li><a href="#" className="hover:opacity-100 transition">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-sm opacity-75">
        <p>&copy; 2024 Williams Sonoma Home. All rights reserved.</p>
      </div>
    </footer>
  );
};

export const Loading: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="inline-block w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-secondary font-serif">Loading...</p>
    </div>
  </div>
);

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = () => setHasError(true);
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-serif mb-4">Something went wrong</h2>
        <button onClick={() => setHasError(false)} className="btn">
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
