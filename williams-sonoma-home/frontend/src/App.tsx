import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/store';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrdersPage } from './pages/OrdersPage';
import { ManufacturerDashboard } from './pages/ManufacturerDashboard';
import { ManufacturerProductDetail } from './pages/ManufacturerProductDetail';
import { ManufacturerProducts } from './pages/ManufacturerProducts';
import { AdminDashboard } from './pages/AdminDashboard';

// Styles
import './styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { token } = useAuthStore();

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored && !token) {
      // Token already in storage, Zustand will initialize on first use
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:skuId" element={<ProductDetailPage />} />

        {/* Customer Routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute requiredRole="customer">
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Manufacturer Routes */}
        <Route
          path="/manufacturer"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturer/products"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturer/product/:skuId"
          element={
            <ProtectedRoute requiredRole="manufacturer">
              <ManufacturerProductDetail />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
