const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/UsuarioModel');

exports.login = async (req, res) => {
  try {
    const { rut_usuario, contraseña } = req.body;
    
    const loginUsuario = await Usuario.findOne({
      where: { rut_usuario }
    });
    
    if (!loginUsuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (contraseña !== loginUsuario.contraseña) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Obtiene el rol y el departamento del usuario
    const { rut_empresa, nombre_usuario, cod_rol, id_departamento, email_usuario } = loginUsuario;

    // Crea un token JWT con la información del usuario
    const token = jwt.sign(
      { rutUsuario: loginUsuario.rut_usuario, cod_rol, id_departamento },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Devuelve el token y otros datos del usuario si es necesario
    res.status(200).json({ rut_empresa, rut_usuario, nombre_usuario, cod_rol, id_departamento, email_usuario, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};


