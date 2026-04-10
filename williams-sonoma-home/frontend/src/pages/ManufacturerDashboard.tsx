import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { AlertCard } from '../components/ProductComponents';
import { useAuthStore } from '../context/store';
import api from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardData {
  priorityActions: any[];
  metrics: any;
  returnRateTrend: any[];
  topReturnReasons: any[];
}

export const ManufacturerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'manufacturer') {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await api.getManufacturerDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  if (loading) return <Loading />;
  if (!dashboard) return <div className="text-center py-12">Failed to load dashboard</div>;

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-12">MANUFACTURER DASHBOARD</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Total Products
            </p>
            <p className="font-serif text-3xl text-primary">{dashboard.metrics.totalProducts}</p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Critical Alerts
            </p>
            <p className="font-serif text-3xl text-[#C62828]">{dashboard.metrics.criticalAlerts}</p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Avg Return Rate
            </p>
            <p className="font-serif text-3xl text-secondary">{dashboard.metrics.averageReturnRate}%</p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Action Items
            </p>
            <p className="font-serif text-3xl text-primary">{dashboard.priorityActions.length}</p>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl mb-6 uppercase">PRIORITY ACTIONS</h2>

          <div className="space-y-4">
            {dashboard.priorityActions.map((action, idx) => (
              <AlertCard
                key={idx}
                level={action.level}
                title={`${action.productName} - ${action.issue}`}
                description={`Revenue at risk: ${action.revenueAtRisk} | Urgency: ${action.urgencyScore}`}
                action={{
                  label: 'Review',
                  onClick: () => navigate(`/manufacturer/product/${action.skuId || 'sku001'}`),
                }}
              />
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Return Rate Trend */}
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-serif text-lg uppercase mb-6">RETURN RATE TREND</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboard.returnRateTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4D9" />
                <XAxis dataKey="week" stroke="#8B7355" />
                <YAxis stroke="#8B7355" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8B7355" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Return Reasons */}
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-serif text-lg uppercase mb-6">TOP RETURN REASONS</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard.topReturnReasons}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4D9" />
                <XAxis dataKey="reason" angle={-45} textAnchor="end" height={100} stroke="#8B7355" />
                <YAxis stroke="#8B7355" />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8B7355" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Management Link */}
        <div className="bg-background border border-gray-300 p-8 text-center">
          <h3 className="font-serif text-2xl mb-4">MANAGE YOUR PRODUCTS</h3>
          <p className="text-gray-700 mb-6">
            Review product performance, update descriptions, and address quality issues
          </p>
          <a href="/manufacturer/products" className="btn text-xs py-2 px-6">
            GO TO PRODUCTS
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
};
