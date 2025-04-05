import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">AptekaOnline</Link>
        <input
          type="text"
          placeholder="Поиск по товарам"
          className="border rounded px-2 py-1 flex-grow mx-4"
        />
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition">
            Корзина
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center space-x-1 hover:text-blue-200">
                <FaUser className="text-xl" />
                <span className="hidden md:inline">Профиль</span>
              </Link>
              <button 
                onClick={logout}
                className="flex items-center space-x-1 hover:text-blue-200"
              >
                <FaSignOutAlt className="text-xl" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition">
                Войти
              </Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
