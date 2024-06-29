const express = require('express');
const router = express.Router();
const DepartamentoController = require('../controllers/DepartamentoController');

// Ruta para obtener todos los departamentos
router.get('/obtenerDepartamentos', DepartamentoController.obtenerDepartamentos);

// Ruta para obtener un departamento
router.get('/obtenerUnDepartamento', DepartamentoController.obtenerUnDepartamento);

router.post('/obtenerDepartamento', DepartamentoController.obtenerDepartamento);


module.exports = router;