import Product from '../models/Product.js';

// Контроллер для работы с продуктами
class ProductController {
  // Метод для добавления нового продукта
  static addProduct(req, res) {
    const { title, price, article, manufacturer, expirationDate, composition, contraindications, storageConditions, recommendations } = req.body;
    const product = new Product(null, title, price, article, manufacturer, expirationDate, composition, contraindications, storageConditions, recommendations);
    product.save();
    res.status(201).json({ message: 'Product added successfully' });
  }

  // Метод для получения всех продуктов
  static getAllProducts(req, res) {
    Product.getAll((err, products) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(products);
    });
  }

  // Метод для получения продукта по ID
  static getProductById(req, res) {
    const { id } = req.params;
    Product.getById(id, (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    });
  }
}

export default ProductController;
