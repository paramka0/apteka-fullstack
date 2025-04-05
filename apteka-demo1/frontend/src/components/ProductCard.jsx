import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Added to cart:', product.name);
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="block"
    >
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
          />
          {product.stock < 20 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Low Stock
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <div className="flex items-center text-yellow-400">
              <FaStar />
              <span className="text-gray-600 text-sm ml-1">4.8</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
            <div className="relative">
              <button 
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition-colors duration-200"
                onClick={handleAddToCart}
              >
                <FaCartPlus />
              </button>
            </div>
          </div>

          {product.stock > 0 ? (
            <div className="mt-2 text-xs text-gray-500">
              In Stock: {product.stock}
            </div>
          ) : (
            <div className="mt-2 text-xs text-red-500">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;