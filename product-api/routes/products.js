const express = require('express');
const router = express.Router();

// In-memory data store
let products = [
  { id: 1, name: 'Product 1', price: 10.0 },
  { id: 2, name: 'Product 2', price: 20.0 },
];
let nextId = 3;

// Get all products with optional filtering and pagination
router.get('/', (req, res) => {
  let result = products;

  if (req.query.name) {
    result = result.filter(p => p.name.toLowerCase().includes(req.query.name.toLowerCase()));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  res.json({
    total: result.length,
    page,
    limit,
    data: result.slice(startIndex, endIndex),
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Add new product
router.post('/', (req, res) => {
  const { name, price } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  const newProduct = {
    id: nextId++,
    name,
    price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;
  const product = products.find(p => p.id === id);
  if (product) {
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete product
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1);
    res.json(deletedProduct[0]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;