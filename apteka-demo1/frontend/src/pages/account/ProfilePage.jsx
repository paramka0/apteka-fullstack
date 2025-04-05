import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../api/orderService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    try {
      console.log('Loading orders for user...');
      setLoading(true);
      setError(null);
      const ordersData = await getMyOrders();
      console.log('Received orders:', ordersData);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to load orders:', {
        message: err.message,
        response: err.response?.data
      });
      setError(err.message || 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p>Для просмотра профиля необходимо авторизоваться</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Личные данные</h2>
            <p className="mb-2"><span className="font-semibold">Телефон:</span> {user.phone}</p>
            <button 
              onClick={logout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Выйти
            </button>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">История заказов</h2>
            
            {loading ? (
              <p>Загрузка заказов...</p>
            ) : error ? (
              <div className="text-red-500">
                <p>{error}</p>
                <button 
                  onClick={loadOrders}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                >
                  Попробовать снова
                </button>
              </div>
            ) : orders.length === 0 ? (
              <p>У вас пока нет заказов</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">Заказ #{order.id}</h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.totalPrice}₽</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.orderStatus === 'Processing' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.orderStatus === 'Processing' ? 'В обработке' : 'Завершен'}
                        </span>
                      </div>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Товары:</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>Товар #{item.productId} × {item.quantity}</span>
                              <span>{item.price * item.quantity}₽</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;