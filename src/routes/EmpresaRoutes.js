const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/EmpresaController');

// Ruta para obtener todos lo Categorias de Productos
router.get('/obtenerEmpresas', EmpresaController.obtenerEmpresas);
router.post('/obtenerEmpresa', EmpresaController.obtenerEmpresa);

module.exports = router;
