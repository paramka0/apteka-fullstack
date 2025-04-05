import sqlite3 from 'sqlite3';

// Создаем модель для работы с продуктами
class Product {
  constructor(id, title, price, article, manufacturer, expirationDate, composition, contraindications, storageConditions, recommendations) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.article = article;
    this.manufacturer = manufacturer;
    this.expirationDate = expirationDate;
    this.composition = composition;
    this.contraindications = contraindications;
    this.storageConditions = storageConditions;
    this.recommendations = recommendations;
  }

  // Метод для сохранения продукта в базе данных
  save() {
    const db = new sqlite3.Database('./database.db');
    const sql = `INSERT INTO products (title, price, article, manufacturer, expirationDate, composition, contraindications, storageConditions, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [this.title, this.price, this.article, this.manufacturer, this.expirationDate, this.composition, this.contraindications, this.storageConditions, this.recommendations], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Product added with ID: ${this.lastID}`);
    });
    db.close();
  }

  // Метод для получения всех продуктов
  static getAll(callback) {
    const db = new sqlite3.Database('./database.db');
    const sql = `SELECT * FROM products`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
    db.close();
  }

  // Метод для получения продукта по ID
  static getById(id, callback) {
    const db = new sqlite3.Database('./database.db');
    const sql = `SELECT * FROM products WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
    db.close();
  }
}

export default Product;
