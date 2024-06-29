const express = require('express');
const router = express.Router();
const OrdenCompraController = require('../controllers/OrdenCompraController');

router.post('/guardarOrdenCompra', OrdenCompraController.guardarOrdenCompra);
router.post('/obtenerOrdenesDeCompraAdquisidor', OrdenCompraController.obtenerOrdenesDeCompraAdquisidor);
router.post('/obtenerOrdenesDeCompraGerencia', OrdenCompraController.obtenerOrdenesDeCompraGerencia);
router.post('/actualizarCompraDetalleAdquisidor', OrdenCompraController.actualizarCompraDetalleAdquisidor);
router.post('/anularOrdenCabecera', OrdenCompraController.anularOrdenCabecera);
router.post('/actualizarEstadoCompra', OrdenCompraController.actualizarEstadoCompra);
router.post('/aprobarCompra', OrdenCompraController.aprobarCompra);
router.post('/confirmarCompraAdquisidor', OrdenCompraController.confirmarCompraAdquisidor);

module.exports = router;
