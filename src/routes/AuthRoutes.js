const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');


require('dotenv').config(); // Carga las variables de entorno desde el archivo .env



// Ruta para obtener un usuario solicitante por su rut
router.get('/test-ruta', (req, res) => {
  res.send('Ruta test');
});

// Ruta de inicio de sesión que no requiere autenticación
router.post('/login', AuthController.login);

module.exports = router;
