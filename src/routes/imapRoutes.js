const express = require('express');
const router = express.Router();


require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

router.get('/descargar-adjuntos/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;
    const resultado = await descargarArchivosAdjuntos(rut_usuario);
    res.json(resultado);
  });

  module.exports = router;
