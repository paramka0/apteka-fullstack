import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../api/apiService';
import { FaBoxOpen, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const OrderHistory = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading orders');
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      fetchOrders();
    }
  }, [auth]);

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-lg">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                <h3 className="font-medium">Order #{order._id.substring(0, 8)}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="text-sm font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Items:</span>
                <span>{order.orderItems.length}</span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Total:</span>
                <div className="flex items-center font-medium">
                  <FaDollarSign className="text-gray-500 mr-1" />
                  {order.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;