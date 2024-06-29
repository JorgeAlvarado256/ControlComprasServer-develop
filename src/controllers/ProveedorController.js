const express = require('express');
const router = express.Router();
const { Proveedor } = require('../models/ProveedorModel');

exports.obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error });
  }
};
exports.obtenerProveedoresPorRutEmpresa = async (req, res) => {
  try {
    const rut_empresa = req.body.rut_empresa
    const proveedores = await Proveedor.findAll({
      where: {
        rut_empresa: rut_empresa
      }
    });
    
    if (!proveedores) {
      return res.status(401).json({ message: 'No hay proveedores para: ' + rut_empresa });
    }

    // Crea un token JWT con la información si es necesario

    // Devuelve el token y otros datos del Producto si es necesario
    res.status(200).json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar proveedores' });
  }
};
exports.obtenerUnProveedor = async (req, res) => {
    try {
      const productos = await Producto.findOne();
      
      if (!productos) {
        return res.status(401).json({ message: 'No hay proveedores' });
      }
  
      // Crea un token JWT con la información si es necesario
  
      // Devuelve el token y otros datos del Producto si es necesario
      res.status(200).json(proveedores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar proveedores' });
    }
  };