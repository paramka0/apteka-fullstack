import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from './catchAsyncErrors.js';
import User from '../models/User.js';

// Check if user is authenticated
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;
  
  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler('Login first to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    console.log('Decoded token:', decoded);
    
    // Проверка структуры токена
    if (!decoded.id || !decoded.phone || typeof decoded.isAdmin === 'undefined') {
      return next(new ErrorHandler('Invalid token structure', 401));
    }

    // Получаем пользователя из SQLite
    req.user = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database('./database.db');
      db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, row) => {
        db.close();
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(new User(row.id, row.phone, row.password, row.isAdmin));
      });
    });
    
    if (!req.user) {
      return next(new ErrorHandler('User not found for this token', 401));
    }

    // Проверка соответствия данных (гарантированное сравнение 0/1)
    const userIsAdmin = req.user.isAdmin ? 1 : 0;
    const tokenIsAdmin = decoded.isAdmin ? 1 : 0;
    
    if (req.user.phone !== decoded.phone || 
        userIsAdmin !== tokenIsAdmin) {
      return next(new ErrorHandler('Token data mismatch', 401));
    }
    
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token expired. Please login again', 401));
    }
    return next(new ErrorHandler('Invalid token. Please login again', 401));
  }
});

// Handle user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};