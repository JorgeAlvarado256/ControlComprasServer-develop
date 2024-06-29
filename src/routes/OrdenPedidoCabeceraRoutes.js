const express = require('express');
const router = express.Router();
const OrdenPedidoCabeceraController = require('../controllers/OrdenPedidoCabeceraController');

router.post('/crearOrdenPedidoCabecera', OrdenPedidoCabeceraController.GuardarOrdenPedidoCabecera);
// router.get('/ObtenerOrdenesPedidoCabecera', OrdenPedidoCabeceraController.ObtenerOrdenPedidoCabecera);
// router.post('/ModificarOrdenPedidoCabecera', OrdenPedidoCabeceraController.ActualizarOrdenPedidoCabecera);

module.exports = router;
