const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/ProductosController');

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Ruta para obtener todos los productos
router.get('/obtenerProductos', ProductosController.obtenerProductos);
router.get('/obtenerProductoPorId:id_producto',ProductosController.obtenerProductoPorId);
module.exports = router;
