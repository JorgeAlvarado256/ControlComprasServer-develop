const express = require('express');
const router = express.Router();
const { Departamento } = require('../models/DepartamentoModel');

exports.obtenerDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll();
    
    if (!departamentos) {
      return res.status(401).json({ message: 'No hay departamentos' });
    }

    // Crea un token JWT con la información si es necesario

    // Devuelve el token y otros datos del Producto si es necesario
    res.status(200).json(departamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar Departamento' });
  }
};
//LISTO
exports.obtenerUnDepartamento = async (req, res) => {
    try {
      const { id_departamento } = req.body;
    
    const departamentos = await Departamento.findOne({
      where: {id_departamento: id_departamento}
    });
      
      if (!departamentos) {
        return res.status(401).json({ message: 'No hay departamento' });
      }
  
      // Crea un token JWT con la información si es necesario
  
      // Devuelve el token y otros datos del Producto si es necesario
      res.status(200).json(departamentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar Departamento' });
    }
};
//LISTO
exports.agregarDepartamento = async (req, res) => {
  try {
 
    const { rut_empresa, cod_departamento, nom_departamento, email_departamento, rut_jefe_departamento } = req.body;

    if (!rut_empresa || !cod_departamento) {
      return res.status(400).json({ mensaje: 'Se requieren rut_empresa y cod_departamento' });
    }
    
    const nuevoDepartamento = new Departamento({
      rut_empresa,
      cod_departamento,
      nom_departamento,
      email_departamento,
      rut_jefe_departamento,
    });

    await nuevoDepartamento.save();

    res.status(201).json({ mensaje: 'Departamento agregado con éxito' });
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar el departamento' });
  }
};
//LISTO

exports.bajaDepartamento = async (req, res) => {
  try {
    let { id_departamento } = req.body;

    // Convertir rut_empresa a cadena si es un número
    id_departamento = String(id_departamento);

    // // Verificar si rut_empresa y cod_departamento están definidos
    // if (!rut_empresa || cod_departamento === undefined) {
    //   return res.status(400).json({ mensaje: 'Se requieren rut_empresa y cod_departamento' });
    // 
  
    // Dar de baja departamento
    const resultado = await Departamento.update( {cod_estado:'B'},{
      where: { id_departamento : id_departamento}
    }).then(numFilasActualizadas => {
      console.log(`${numFilasActualizadas} filas`);

    });

    if (resultado === 0) {
      return res.status(404).json({ mensaje: 'Departamento no encontrado' });
    }

    res.status(200).json({ mensaje: 'Departamento cambiado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el departamento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el departamento', error: error.message });
  }
};
//LISTO

exports.modificarDepartamento = async(req, res) => {

}

exports.obtenerDepartamento = async (req, res) => {
  try {
    const { id_departamento } = req.body;

    const nombre_departamento = await Departamento.findOne({
      attributes: ['nom_departamento'],
      where: { id_departamento: id_departamento },
    });

    if (!nombre_departamento) {
      return res.status(404).json({ message: 'No hay departamento con ese ID' });
    }

    res.status(200).json(nombre_departamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar Departamento' });
  }
};
