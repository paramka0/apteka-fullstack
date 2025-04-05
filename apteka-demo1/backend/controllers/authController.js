import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandler.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const { phone, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User(null, phone, hashedPassword, 0);
      user.save();
      res.status(201).json({ 
        success: true,
        message: 'User registered successfully' 
      });
    } catch (err) {
      next(new ErrorHandler('Registration failed', 500));
    }
  }

  static async login(req, res, next) {
    try {
      const { phone, password } = req.body;
      
      User.getAll(async (err, users) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        
        const user = users.find(u => u.phone === phone);
        if (!user) {
          return next(new ErrorHandler('Invalid credentials', 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return next(new ErrorHandler('Invalid credentials', 401));
        }

        // Генерация JWT токена
        const token = jwt.sign(
          { 
            id: user.id, 
            phone: user.phone, 
            isAdmin: user.isAdmin ? 1 : 0 // Гарантированное значение 0 или 1
          },
          process.env.JWT_SECRET,
          { 
            expiresIn: process.env.JWT_EXPIRES || '24h',
            algorithm: 'HS256'
          }
        );

        // Установка токена в cookie
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 3600000 // 1 час
        });

        res.status(200).json({
          success: true,
          token,
          user: {
            id: user.id,
            phone: user.phone,
            isAdmin: user.isAdmin
          }
        });
      });
    } catch (err) {
      next(new ErrorHandler('Login failed', 500));
    }
  }

  static logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  static getAllUsers(req, res, next) {
    User.getAll((err, users) => {
      if (err) return next(new ErrorHandler(err.message, 500));
      res.status(200).json(users);
    });
  }
}

export default AuthController;