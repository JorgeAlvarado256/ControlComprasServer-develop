const { Usuario } = require('../models/UsuarioModel');

// Controlador para obtener todos los usuarios solicitantes
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios solicitantes' });
  }
};

// Controlador para crear un nuevo usuario solicitante
exports.createUsuario = async (req, res) => {
  try {
    const usuarios = await Usuario.create(req.body);
    res.status(201).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear un usuario solicitante' });
  }
};

// Controlador para obtener un usuario solicitante por su rut
exports.getUsuario = async (req, res) => {
    try {
      const { rut_usuario } = req.params; // Suponiendo que el rut se pasa como parámetro en la URL
      const usuarios = await Usuario.findOne({ where: { rut_usuario } });
  
      if (!usuarios) {
        return res.status(404).json({ message: 'Usuario solicitante no encontrado' });
      }
  
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener usuario solicitante' });
    }
  };

  
  exports.getUsuarioByRut = async (req, res) => {
    try {
      const { rut_usuario } = req.params; // Suponiendo que el rut se pasa como parámetro en la URL
      const usuario = await Usuario.findOne({ where: { rut_usuario } });
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario solicitante no encontrado' });
      }
  
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener usuario solicitante' });
    }
  };