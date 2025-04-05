import sqlite3 from 'sqlite3';

export const getAdminStats = async (req, res) => {
  const db = new sqlite3.Database('./pharmacy.db');
  
  try {
    db.get('SELECT COUNT(*) as users FROM users', (err, users) => {
      if (err) throw err;
      
      db.get('SELECT COUNT(*) as products FROM products', (err, products) => {
        if (err) throw err;
        
        db.get('SELECT COUNT(*) as orders FROM orders', (err, orders) => {
          if (err) throw err;
          
          db.get('SELECT SUM(totalPrice) as revenue FROM orders', (err, revenue) => {
            db.close();
            if (err) throw err;
            
            res.status(200).json({
              success: true,
              stats: {
                users: users.users,
                products: products.products,
                orders: orders.orders,
                revenue: revenue.revenue || 0
              }
            });
          });
        });
      });
    });
  } catch (error) {
    db.close();
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats'
    });
  }
};

export const getAllOrders = async (req, res) => {
  const db = new sqlite3.Database('./pharmacy.db');
  
  try {
    db.all(
      `SELECT o.*, u.name as userName, u.email as userEmail 
       FROM orders o
       JOIN users u ON o.userId = u.id
       ORDER BY o.createdAt DESC`,
      (err, orders) => {
        db.close();
        if (err) throw err;
        
        res.status(200).json({
          success: true,
          orders
        });
      }
    );
  } catch (error) {
    db.close();
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const db = new sqlite3.Database('./pharmacy.db');
  const { id } = req.params;
  const { status } = req.body;

  try {
    db.run(
      'UPDATE orders SET orderStatus = ? WHERE id = ?',
      [status, id],
      function(err) {
        db.close();
        if (err) throw err;
        
        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Order status updated'
        });
      }
    );
  } catch (error) {
    db.close();
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

export const deleteOrder = async (req, res) => {
  const db = new sqlite3.Database('./pharmacy.db');
  const { id } = req.params;

  try {
    db.run(
      'DELETE FROM orders WHERE id = ?',
      [id],
      function(err) {
        db.close();
        if (err) throw err;
        
        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Order deleted successfully'
        });
      }
    );
  } catch (error) {
    db.close();
    res.status(500).json({
      success: false,
      message: 'Error deleting order'
    });
  }
};