import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminPage from './pages/admin/AdminPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/account/ProfilePage';
import ProductPage from './pages/ProductPage';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;