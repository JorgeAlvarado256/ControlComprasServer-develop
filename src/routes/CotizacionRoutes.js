const express = require('express');
const router = express.Router();
const CotizacionController = require('../controllers/CotizacionController');
const authenticateToken=require('../controllers/verificarToken')

router.get('/informacionCotizaciones/:nivelDetalle', CotizacionController.obtenerInformacionCotizaciones);

router.put('/actualizarCotizacion/:id', CotizacionController.actualizarCotizacion);
router.delete('/eliminarCotizacion/:id', CotizacionController.eliminarCotizacion);
router.post('/enviarSolicitudCotizacion', CotizacionController.enviarSolicitudCotizacion);
router.post('/generarSolicitudCotizacion', CotizacionController.crearCotizacion);
router.put('/agregarProveedorCotizacion/:id_cotizacion/:id_proveedores/:rut_usuario', authenticateToken, CotizacionController.actualizarProveedorCotizacion);
router.put('/actualizarPedido/:id', CotizacionController.actualizarPedido);
router.put('/cotizaciones/:id_cotizacion/:id_proveedores/estado', CotizacionController.actualizarEstadoCotizacion);
router.post('/guardar-solicitud-cotizacion', CotizacionController.guardarSolicitudCotizacion);
router.get('/cotizaciones-no-registrado', CotizacionController.cotizacionesNoRegistrado);

module.exports = router;
