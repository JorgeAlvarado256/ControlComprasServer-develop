const express = require('express');
const router = express.Router();
const CategoriaProductoController = require('../controllers/CategoriaProductoController');

// Ruta para obtener todos lo Categorias de Productos
router.get('/obtenerCategoriasProductos', CategoriaProductoController.obtenercategoriasProductos);
router.post('/obtenerCategoriasProductosPorEmpresa', CategoriaProductoController.obtenerCategoriasProductosPorEmpresa);

module.exports = router;
