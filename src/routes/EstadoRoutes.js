const express = require('express');
const router = express.Router();
const EstadoController = require('../controllers/EstadoController');

// Ruta para obtener todos los estados de Pedido
router.get('/obtenerEstadoPedido', EstadoController.obtenerEstadoPedido);

module.exports = router;