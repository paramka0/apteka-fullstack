import sqlite3 from 'sqlite3';

// Создаем модель для работы с пользователями
class User {
  constructor(id, phone, password, isAdmin = false) {
    this.id = id;
    this.phone = phone;
    this.password = password;
    this.isAdmin = isAdmin; // Добавлено поле isAdmin
  }

  // Метод для сохранения пользователя в базе данных
  save() {
    const db = new sqlite3.Database('./database.db');
    const sql = `INSERT INTO users (phone, password, isAdmin) VALUES (?, ?, ?)`; // Обновленный SQL-запрос
    db.run(sql, [this.phone, this.password, this.isAdmin], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`User added with ID: ${this.lastID}`);
    });
    db.close();
  }

  // Метод для получения всех пользователей
  static getAll(callback) {
    const db = new sqlite3.Database('./database.db');
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
    db.close();
  }
}

export default User;
