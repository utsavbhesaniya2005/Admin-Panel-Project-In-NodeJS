const express = require('express');
const productRoute = express.Router();
const productController = require('../controllers/productController');
const uploads = require('../middlewares/multer');
const authMiddleware = require('../middlewares/auth');

// All Products Listing
productRoute.get('/', authMiddleware.auth, productController.allProducts);

// Add Product Page Render
productRoute.get('/add', authMiddleware.auth, productController.add);

// Product Add In Database
productRoute.post('/add', uploads.single('productImage'), productController.saveProduct);

// Product Edit Page Render
productRoute.get('/edit/:id', productController.edit);

// Product Update In Database
productRoute.post('/edit/:id', uploads.single('productImage'), productController.update);

// Product Delete In Database
productRoute.get('/delete/:id', productController.deleteProduct);

module.exports = productRoute;