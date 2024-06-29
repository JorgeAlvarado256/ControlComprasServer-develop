const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/ProveedorController');

//require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Ruta para obtener todos los productos
router.get('/proveedores', ProveedorController.obtenerProveedores);
router.post('/obtenerProveedoresPorRutEmpresa', ProveedorController.obtenerProveedoresPorRutEmpresa);

module.exports = router;
