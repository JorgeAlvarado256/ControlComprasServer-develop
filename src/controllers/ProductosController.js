const express = require('express');
const router = express.Router();
const  Producto  = require('../models/ProductoModel');

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    
    if (!productos) {
      return res.status(401).json({ message: 'No hay productos' });
    }

    // Crea un token JWT con la información si es necesario

    // Devuelve el token y otros datos del Producto si es necesario
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar Productos' });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
    try {
      const { id_producto } = req.body
      const producto = await Producto.findOne({
        where: {id_producto: id_producto}
      });
      
      if (!producto) {
        return res.status(401).json({ message: 'Producto no encontrado' });
      }
  
      // Crea un token JWT con la información si es necesario
  
      // Devuelve el token y otros datos del Producto si es necesario
      res.status(200).json(producto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar Producto' });
    }
  };