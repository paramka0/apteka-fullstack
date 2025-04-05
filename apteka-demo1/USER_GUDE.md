# Pharmacy Application User Guide

## System Requirements
- Node.js v16+
- MongoDB v4+
- npm/yarn

## Installation
1. Clone the repository
2. Install dependencies:
```bash
cd pharmacy-app
npm install
cd backend
npm install
cd ../frontend
npm install
```

## Configuration
1. Create `.env` file in backend with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pharmacy
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
```

## Running the Application
1. Start backend:
```bash
cd backend
npm start
```

2. Start frontend:
```bash
cd frontend
npm start
```

## Admin Setup
1. Register first user
2. Manually set `role: 'admin'` in MongoDB:
```javascript
db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
```

## Managing Products
Admin users can:
- Add/edit/delete products
- Manage categories
- View and update orders
- Manage user accounts

## User Features
- Browse products with filters
- Add to cart
- Checkout process
- Order history
- Account management