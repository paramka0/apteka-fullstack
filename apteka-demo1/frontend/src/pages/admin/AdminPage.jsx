import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header'; // Импортируем Header
import Footer from '../../components/Footer'; // Импортируем Footer

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    price: '', 
    article: '', 
    manufacturer: '', 
    expirationDate: '', 
    composition: '', 
    contraindications: '', 
    storageConditions: '', 
    recommendations: '' 
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers(); // Обновить список пользователей после удаления
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setMessage('Продукт добавлен успешно!');
      setNewProduct({ 
        title: '', 
        price: '', 
        article: '', 
        manufacturer: '', 
        expirationDate: '', 
        composition: '', 
        contraindications: '', 
        storageConditions: '', 
        recommendations: '' 
      }); // Очистить форму
    } catch (error) {
      console.error('Ошибка при добавлении продукта:', error);
      setMessage('Ошибка при добавлении продукта.');
    }
  };

  return (
    <div className="m-0"> {/* Убираем все отступы */}
      <Header /> {/* Добавляем Header */}
      <h1 className="text-2xl font-bold mb-4">Админ Панель</h1>
      <h2 className="text-xl font-semibold mb-2">Список пользователей</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Телефон</th>
            <th className="border border-gray-300 p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2">{user.id}</td>
              <td className="border border-gray-300 p-2">{user.phone}</td>
              <td className="border border-gray-300 p-2">
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-6 mb-2">Добавить продукт</h2>
      <form onSubmit={handleAddProduct} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Название продукта:</label>
          <input
            type="text"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Цена продукта:</label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Артикул:</label>
          <input
            type="text"
            value={newProduct.article}
            onChange={(e) => setNewProduct({ ...newProduct, article: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Производитель:</label>
          <input
            type="text"
            value={newProduct.manufacturer}
            onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Срок годности:</label>
          <input
            type="text"
            value={newProduct.expirationDate}
            onChange={(e) => setNewProduct({ ...newProduct, expirationDate: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Состав:</label>
          <input
            type="text"
            value={newProduct.composition}
            onChange={(e) => setNewProduct({ ...newProduct, composition: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Противопоказания:</label>
          <input
            type="text"
            value={newProduct.contraindications}
            onChange={(e) => setNewProduct({ ...newProduct, contraindications: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Условия хранения:</label>
          <input
            type="text"
            value={newProduct.storageConditions}
            onChange={(e) => setNewProduct({ ...newProduct, storageConditions: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Рекомендации:</label>
          <input
            type="text"
            value={newProduct.recommendations}
            onChange={(e) => setNewProduct({ ...newProduct, recommendations: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">Добавить продукт</button>
      </form>
      {message && <p className="text-green-500">{message}</p>}
      <Footer /> {/* Добавляем Footer */}
    </div>
  );
};

export default AdminPage;
