import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { useAuthStore } from '../context/store';
import api from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  overallReturnRate: number;
  averageRating: number;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [topIssues, setTopIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const [statsRes, catRes, mfgRes, issuesRes] = await Promise.all([
          api.getStats(),
          api.getCategories_admin(),
          api.getManufacturers(),
          api.getTopIssues(),
        ]);

        setStats(statsRes.data);
        setCategories(catRes.data.categories);
        setManufacturers(mfgRes.data.manufacturers);
        setTopIssues(issuesRes.data.topIssues);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  if (loading) return <Loading />;
  if (!stats) return <div className="text-center py-12">Failed to load dashboard</div>;

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-12">ADMIN DASHBOARD</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Total Revenue
            </p>
            <p className="font-serif text-3xl text-primary">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Total Orders
            </p>
            <p className="font-serif text-3xl text-primary">{stats.totalOrders}</p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Return Rate
            </p>
            <p className="font-serif text-3xl text-secondary">{stats.overallReturnRate}%</p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
              Avg Rating
            </p>
            <p className="font-serif text-3xl text-amber-500">⭐ {stats.averageRating}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Category Performance */}
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-serif text-lg uppercase mb-6">CATEGORY PERFORMANCE</h3>

            <div className="space-y-3">
              {categories.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{cat.category}</span>
                  <div className="flex-1 mx-4 bg-gray-200 h-2">
                    <div
                      className="bg-secondary h-2"
                      style={{ width: `${(cat.productCount / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-secondary w-12 text-right">
                    {cat.productCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Issues */}
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-serif text-lg uppercase mb-6">PLATFORM-WIDE ISSUES</h3>

            <div className="space-y-3">
              {topIssues.slice(0, 5).map((issue, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 capitalize">{issue.issue}</span>
                  <span className="text-xs font-semibold bg-secondary text-white px-3 py-1">
                    {issue.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manufacturers */}
        <div className="bg-white border border-gray-300 p-6 mb-12">
          <h3 className="font-serif text-lg uppercase mb-6">TOP MANUFACTURERS</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-secondary uppercase">Brand</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary uppercase">Products</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary uppercase">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {manufacturers.map((mfg, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-background">
                    <td className="py-3 px-4">{mfg.brand}</td>
                    <td className="py-3 px-4">{mfg.productCount}</td>
                    <td className="py-3 px-4">${mfg.averagePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
