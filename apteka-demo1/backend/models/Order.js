import sqlite3 from 'sqlite3';

export default class Order {
  static findByUser(userId) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db');
      
      db.serialize(() => {
        db.all(
          `SELECT o.*, 
           (SELECT GROUP_CONCAT(oi.productId || ':' || oi.quantity || ':' || oi.price, ',') 
            FROM order_items oi WHERE oi.orderId = o.id) as items
           FROM orders o 
           WHERE o.userId = ? 
           ORDER BY o.createdAt DESC`,
          [userId],
          (err, orders) => {
            db.close();
            if (err) return reject(err);
            
            const formattedOrders = orders.map(order => ({
              ...order,
              items: order.items ? order.items.split(',').map(item => {
                const [productId, quantity, price] = item.split(':');
                return { productId, quantity: parseInt(quantity), price: parseFloat(price) };
              }) : []
            }));
            
            resolve(formattedOrders);
          }
        );
      });
    });
  }

  static create(orderData) {
    console.log('Starting order creation with data:', orderData);
    
    // Валидация данных
    if (!orderData.userId || !orderData.items || !Array.isArray(orderData.items)) {
      return Promise.reject(new Error('Invalid order data'));
    }

    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE);
      
      db.serialize(() => {
        const sql = `INSERT INTO orders (
            userId, itemsPrice, taxPrice, shippingPrice, 
            totalPrice, orderStatus, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [
          orderData.userId,
          orderData.itemsPrice || 0,
          orderData.taxPrice || 0,
          orderData.shippingPrice || 0,
          orderData.totalPrice || 0,
          orderData.orderStatus || 'Processing',
          new Date().toISOString()
        ];
        
        console.log('Executing SQL:', sql);
        console.log('With parameters:', params);
        
        db.run(sql, params, function(err) {
          if (err) {
            console.error('Error creating order:', err);
            db.close();
            return reject(err);
          }
          
          const orderId = this.lastID;
          console.log('Order created in DB with ID:', orderId);
          
          // Проверяем что заказ записался
          db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
            if (err) {
              console.error('Error verifying order:', err);
              db.close();
              return reject(err);
            }
            if (!row) {
              console.error('Order not found after creation');
              db.close();
              return reject(new Error('Order not found after creation'));
            }
            
            console.log('Verified order:', row);
            const items = orderData.items.map(item => [
              orderId, 
              item.productId,
              item.quantity,
              item.price
            ]);

            const stmt = db.prepare(
              `INSERT INTO order_items 
               (orderId, productId, quantity, price) 
               VALUES (?, ?, ?, ?)`
            );

            // Вставляем все товары заказа
            items.forEach(item => {
              stmt.run(item, (err) => {
                if (err) {
                  console.error('Error inserting order item:', err);
                  db.close();
                  return reject(err);
                }
              });
            });

            stmt.finalize((err) => {
              db.close();
              if (err) {
                console.error('Error finalizing statement:', err);
                return reject(err);
              }
              console.log(`Successfully created order ${orderId} with ${items.length} items`);
              resolve({ id: orderId, ...orderData });
            });
          });
        });
      });
    });
  }

  static findById(id) {
    // Проверяем, что ID является числом
    if (isNaN(Number(id))) {
      return Promise.reject(new Error('Invalid order ID'));
    }
    
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db');
      
      db.serialize(() => {
        db.get(
          `SELECT o.*,
           (SELECT GROUP_CONCAT(oi.productId || ':' || oi.quantity || ':' || oi.price, ',')
            FROM order_items oi WHERE oi.orderId = o.id) as items
           FROM orders o
           WHERE o.id = ?`,
          [id],
          (err, order) => {
            db.close();
            if (err) return reject(err);
            if (!order) return reject(new Error('Order not found'));

            order.items = order.items ? order.items.split(',').map(item => {
              const [productId, quantity, price] = item.split(':');
              return { productId, quantity: parseInt(quantity), price: parseFloat(price) };
            }) : [];
            
            resolve(order);
          }
        );
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db');
      
      db.serialize(() => {
        db.all(
          `SELECT o.*, u.phone as userPhone,
           (SELECT GROUP_CONCAT(oi.productId || ':' || oi.quantity || ':' || oi.price, ',')
            FROM order_items oi WHERE oi.orderId = o.id) as items
           FROM orders o
           JOIN users u ON o.userId = u.id
           ORDER BY o.createdAt DESC`,
          (err, orders) => {
            db.close();
            if (err) return reject(err);
            
            const formattedOrders = orders.map(order => ({
              ...order,
              items: order.items ? order.items.split(',').map(item => {
                const [productId, quantity, price] = item.split(':');
                return { productId, quantity: parseInt(quantity), price: parseFloat(price) };
              }) : []
            }));
            
            resolve(formattedOrders);
          }
        );
      });
    });
  }

  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db');
      
      db.serialize(() => {
        db.run(
          `UPDATE orders SET orderStatus = ? WHERE id = ?`,
          [status, id],
          function(err) {
            db.close();
            if (err) return reject(err);
            resolve({ id, status });
          }
        );
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db');
      
      db.serialize(() => {
        // Сначала удаляем элементы заказа
        db.run(`DELETE FROM order_items WHERE orderId = ?`, [id], (err) => {
          if (err) {
            db.close();
            return reject(err);
          }
          
          // Затем удаляем сам заказ
          db.run(`DELETE FROM orders WHERE id = ?`, [id], (err) => {
            db.close();
            if (err) return reject(err);
            resolve(true);
          });
        });
      });
    });
  }
}
