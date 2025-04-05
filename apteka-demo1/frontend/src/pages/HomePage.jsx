import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/apiService';

const HomePage = () => {
  const [price, setPrice] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Для добавления в корзину необходимо авторизоваться');
      return;
    }
    addToCart(product);
  };

  if (loading) return <div className="text-center py-8">Загрузка товаров...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Ошибка: {error}</div>;

  return (
    <div>
      <Header />
      {/* Filters Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold mb-4">Фильтры</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Ценовой сегмент</h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={price}
              onChange={handlePriceChange}
              className="w-full"
            />
            <p>Текущая цена: {price}₽</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold cursor-pointer" onClick={toggleCategories}>
              Категории
            </h3>
            {showCategories && (
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span>Все категории</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Лекарства</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Витамины и БАД</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Красота</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Гигиена</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Personal Care</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Линзы</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Ортопедия</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Здоровое питание</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span>Медтехника</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Daily Deals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-left mb-12">Товары дня</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    onAddToCart(product, e);
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <Link to={`/product/${product.id}`} className="bg-white p-6 rounded-lg shadow-md text-left relative">
      <img 
        src={product.image || require('../images/image 1.png')} 
        alt={product.title} 
        className="w-full h-32 object-cover mb-4" 
      />
      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-4 text-lg">Цена: {product.price}₽</p>
      <button 
        className={`py-2 px-4 rounded-lg absolute bottom-4 right-4 transition-all duration-300 ${
          isClicked 
            ? 'bg-green-500 text-white scale-95' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        onClick={handleClick}
      >
        {isClicked ? '✓ Добавлено' : 'В корзину'}
      </button>
    </Link>
  );
};

export default HomePage;
