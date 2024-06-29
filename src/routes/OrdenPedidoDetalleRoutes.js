const express = require('express');
const router = express.Router();
const ordenPedidoDetalleController = require('../controllers/OrdenPedidoDetallesController');

router.post('/crearOrdenDetalle', ordenPedidoDetalleController.GuardarOrdenPedidoDetalle);
router.post('/obtenerPedidosUsuario', ordenPedidoDetalleController.obtenerPedidosUsuario);
router.post('/actualizarPedidoDetalleSolicitante', ordenPedidoDetalleController.actualizarPedidoDetalleSolicitante);
router.post('/anularOrdenPedido', ordenPedidoDetalleController.anularOrdenPedido);
router.post('/obtenerPedidosJefatura', ordenPedidoDetalleController.obtenerPedidosJefatura);
router.post('/actualizarEstadoPedido', ordenPedidoDetalleController.actualizarEstadoPedido);
router.post('/actualizarPedidoDetalleJefatura', ordenPedidoDetalleController.actualizarPedidoDetalleJefatura);
router.post('/obtenerPedidosAprobados', ordenPedidoDetalleController.obtenerPedidosAprobados);

module.exports = router;
