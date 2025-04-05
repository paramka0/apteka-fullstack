import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// Маршрут для регистрации нового пользователя
router.post('/register', AuthController.register);

// Маршрут для входа в аккаунт
router.post('/login', AuthController.login);

// Маршрут для получения всех пользователей
router.get('/users', AuthController.getAllUsers);

export default router;
