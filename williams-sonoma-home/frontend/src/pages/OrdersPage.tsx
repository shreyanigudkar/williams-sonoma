import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/Layout';
import { useAuthStore } from '../context/store';
import api from '../services/api';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.getOrders();
        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleInitiateReturn = (order: Order) => {
    setSelectedOrder(order);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-12">YOUR ORDERS</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No orders yet</p>
            <a href="/catalog" className="btn text-xs py-2 px-4">
              START SHOPPING
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white border border-gray-300 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-2">
                      Order #{order.orderId.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-xl text-secondary">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-semibold uppercase mt-2 inline-block px-3 py-1 ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm mb-3 font-semibold">Items ({order.itemCount})</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">{item.productName}</span>
                      <span className="text-gray-600">
                        Qty: {item.quantity} @ ${item.pricePerUnit.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleInitiateReturn(order)}
                  className="text-xs uppercase tracking-wider text-secondary font-semibold hover:text-primary transition"
                >
                  INITIATE RETURN →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Return Modal */}
      {selectedOrder && (
        <ReturnModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSubmit={(reason, note) => {
            console.log('Return initiated:', reason, note);
            setSelectedOrder(null);
          }}
        />
      )}

      <Footer />
    </>
  );
};

const ReturnModal: React.FC<{
  order: Order;
  onClose: () => void;
  onSubmit: (reason: string, note: string) => void;
}> = ({ order, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    try {
      // Submit return for first item as demo
      if (order.items.length > 0) {
        const item = order.items[0];
        await api.createReturn({
          orderId: order.orderId,
          orderItemId: '', // Empty for demo
          skuId: '', // Empty for demo
          reason,
          note,
        });
      }
      onSubmit(reason, note);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
      <div className="bg-white p-8 max-w-md w-full border border-gray-300">
        <h2 className="font-serif text-2xl mb-4">INITIATE RETURN</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm uppercase tracking-wide font-semibold mb-2">
              Return Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="">Select a reason</option>
              <option value="damaged">Damaged on arrival</option>
              <option value="color_mismatch">Color mismatch</option>
              <option value="size_issue">Size inaccuracy</option>
              <option value="quality">Quality not as expected</option>
              <option value="changed_mind">Changed mind</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm uppercase tracking-wide font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us more details..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 bg-white text-primary uppercase tracking-wider text-xs font-semibold hover:bg-gray-50 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || !reason}
              className="flex-1 btn text-xs disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : 'SUBMIT RETURN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
