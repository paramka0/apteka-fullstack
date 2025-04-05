import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Добавляем токен авторизации
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyOrders = async () => {
  try {
    console.log('Making request to /orders/me');
    const response = await api.get('/orders/me');
    console.log('Response from /orders/me:', {
      status: response.status,
      data: response.data
    });
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    console.log('Creating order at /orders/new');
    const response = await api.post('/orders/new', orderData);
    console.log('Order created:', response.data);
    return response.data.order;
  } catch (error) {
    console.error('Error creating order:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

export default {
  getMyOrders,
  createOrder
};
