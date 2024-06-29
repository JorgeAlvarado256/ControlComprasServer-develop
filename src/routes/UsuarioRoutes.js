const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const UsuarioController = require('../controllers/UsuarioController');
const UsuarioController = require('../controllers/UsuarioController');

const { faker } = require("@faker-js/faker");

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

router.get('/obtenerUsuarios', UsuarioController.getAllUsuarios);
router.get('/obtenerUsuarios/:rut_usuario', UsuarioController.getUsuarioByRut);
router.get('/usuarioAutenticado/:rut_usuario', UsuarioController.getUsuarioByRut);

module.exports = router;
