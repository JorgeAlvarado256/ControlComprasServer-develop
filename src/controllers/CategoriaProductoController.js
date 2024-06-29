const express = require('express');
const router = express.Router();
const { CategoriaProducto } = require('../models/CategoriaProductoModel');

exports.obtenercategoriasProductos = async (req, res) => {
  try {
    const categoriasProductos = await CategoriaProducto.findAll();
    
    if (!categoriasProductos) {
      return res.status(401).json({ message: 'No hay categorías' });
    }

    // Crea un token JWT con la información si es necesario

    // Devuelve el token y otros datos de categorías si es necesario
    res.status(200).json(categoriasProductos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar categorías' });
  }
};

// exports.obtenerUnProveedor = async (req, res) => {
//   try {
//     const productos = await Producto.findOne();
    
//     if (!productos) {
//       return res.status(401).json({ message: 'No hay proveedores' });
//     }

//     // Crea un token JWT con la información si es necesario

//     // Devuelve el token y otros datos del Producto si es necesario
//     res.status(200).json(proveedores);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al buscar proveedores' });
//   }
// };    
exports.obtenerCategoriasProductosPorEmpresa = async (req, res) => {
  try {
    const { rut_empresa } = req.body;
    const categoriasProductos = await CategoriaProducto.findAll({
      where: {rut_empresa: rut_empresa}
    });
    
    if (!categoriasProductos) {
      return res.status(401).json({ message: 'No hay proveedores' });
    }

    // Crea un token JWT con la información si es necesario

    // Devuelve el token y otros datos del Producto si es necesario
    res.status(200).json(categoriasProductos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar categorías' });
  }
};