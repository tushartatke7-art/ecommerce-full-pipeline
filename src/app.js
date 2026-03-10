const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'eCommerce app is running!' });
});

app.get('/products', (req, res) => {
  const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Sneakers', price: 79.99, category: 'Footwear' },
    { id: 3, name: 'Backpack', price: 49.99, category: 'Accessories' },
  ];
  res.status(200).json({ success: true, products });
});

app.get('/products/:id', (req, res) => {
  const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Sneakers', price: 79.99, category: 'Footwear' },
    { id: 3, name: 'Backpack', price: 49.99, category: 'Accessories' },
  ];
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({ success: true, product });
});

app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    item: { productId, quantity }
  });
});

module.exports = app;
