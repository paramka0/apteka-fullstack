import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('main');
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 text-center">
        Загрузка...
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8 text-center">
        Товар не найден
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{product.title}</h1>
        
        <div className="flex space-x-4 mb-8 border-b pb-4">
          <button
            onClick={() => {
              setActiveTab('main');
              scrollToSection('main');
            }}
            className={`px-4 py-2 rounded-lg ${activeTab === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Основные
          </button>
          <button
            onClick={() => {
              setActiveTab('instructions');
              scrollToSection('instructions');
            }}
            className={`px-4 py-2 rounded-lg ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Инструкция
          </button>
          <button
            onClick={() => {
              setActiveTab('reviews');
              scrollToSection('reviews');
            }}
            className={`px-4 py-2 rounded-lg ${activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Отзывы
          </button>
        </div>

        <section id="main" className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Основная информация</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 -ml-4 md:ml-0">
                <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={require('../images/image 1.png')} 
                    alt={product.title}
                    className="max-w-full max-h-80 object-contain"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <p className="text-gray-600">Артикул:</p>
                    <p className="font-medium">{product.article}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Производитель:</p>
                    <p className="font-medium">{product.manufacturer}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Срок годности:</p>
                    <p className="font-medium">{product.expirationDate}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Цена:</p>
                    <p className="text-xl font-bold text-blue-600">{product.price} ₽</p>
                  </div>
                </div>

                <button 
                  className={`w-full md:w-auto px-6 py-3 rounded-lg transition-colors ${
                    isAdding 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => {
                    setIsAdding(true);
                    addToCart(product);
                    setTimeout(() => setIsAdding(false), 1000);
                  }}
                >
                  {isAdding ? 'Добавлено!' : 'Добавить в корзину'}
                </button>

                <div className="mt-8 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Состав:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.composition && product.composition.split(',').map((item, index) => (
                        <li key={index}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Противопоказания:</h3>
                    <p>{product.contraindications}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Условия хранения:</h3>
                    <p>{product.storageConditions}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Рекомендации:</h3>
                    <p>{product.recommendations}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="instructions" className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Инструкция по применению</h2>
            <div className="text-gray-700">
              {product.instructions ? (
                product.instructions
              ) : (
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Инструкция будет добавлена позже');
                  }}
                >
                  Инструкция по применению...
                </a>
              )}
            </div>
          </div>
        </section>

        <section id="reviews" className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Отзывы</h2>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.slice(0, showAllReviews ? product.reviews.length : 2).map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">{review.author}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">{"⭐".repeat(review.rating)}</span>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{review.text}</p>
                  </div>
                ))}
                {!showAllReviews && product.reviews.length > 2 && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Показать все отзывы ({product.reviews.length})
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Отзывов пока нет</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
