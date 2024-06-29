const express = require('express');
const router = express.Router();
const CotizacionController = require('../controllers/CotizacionController');
const authenticateToken=require('../controllers/verificarToken')
const passport = require('passport');

router.get('/obtenerCotizaciones', CotizacionController.obtenerCotizaciones);
router.get('/obtenerSolicitudes', CotizacionController.obtenerSolicitudes);
router.get('/detalles', CotizacionController.obtenerDetallesCotizacion);
router.put('/actualizarCotizacion/:id', CotizacionController.actualizarCotizacion);
router.delete('/eliminarCotizacion/:id', CotizacionController.eliminarCotizacion);
router.post('/enviarSolicitudCotizacion', CotizacionController.enviarSolicitudCotizacion);
router.get('/obtenerPedidosCotizados', CotizacionController.obtenerPedidosCotizados);
router.post('/generarSolicitudCotizacion', CotizacionController.crearCotizacion);
router.put('/agregarProveedorCotizacion/:id_cotizacion/:id_proveedores/:rut_usuario', authenticateToken, CotizacionController.actualizarProveedorCotizacion);
// router.get('/agregarProveedorCotizacion/:id_cotizacion/:id_proveedores/:rut_usuario', 
//   passport.authenticate('local', { session: true }), // Autenticar con Passport.js
//   CotizacionController.agregarProveedorCotizacion
// );

router.put('/actualizarPedido/:id', CotizacionController.actualizarPedido);
router.put('/cotizaciones/:id_cotizacion/estado', CotizacionController.actualizarEstadoCotizacion);
router.post('/guardar-solicitud-cotizacion', CotizacionController.guardarSolicitudCotizacion);

module.exports = router;
