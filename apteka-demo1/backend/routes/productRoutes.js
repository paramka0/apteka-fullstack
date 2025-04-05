import express from 'express';
import ProductController from '../controllers/productController.js';

const router = express.Router();

// Маршрут для добавления нового продукта
router.post('/products', ProductController.addProduct);

// Маршрут для получения всех продуктов
router.get('/products', ProductController.getAllProducts);

// Маршрут для получения продукта по ID
router.get('/products/:id', ProductController.getProductById);

export default router;