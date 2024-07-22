const express = require('express');
const router = express.Router();


require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

router.get('/recibir-correos', async (req, res) => {
  try {
      const emails = await recibirCorreos();
      res.status(200).json(emails);
  } catch (error) {
      res.status(500).json({ message: 'Error al recibir correos', error: error.message });
  }
});

  module.exports = router;
