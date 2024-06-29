const express = require('express');
const router = express.Router();
const { Empresa } = require('../models/EmpresaModel');

exports.obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    
    if (!empresas) {
      return res.status(401).json({ message: 'No hay empresas' });
    }

    // Crea un token JWT con la información si es necesario

    // Devuelve el token y otros datos si es necesario
    res.status(200).json(empresas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar Empresa' });
  }
};
//LISTO
exports.obtenerEmpresa = async (req, res) => {
    try {
      const { rut_empresa } = req.body;
    
    const empresa = await Empresa.findOne({
      where: {rut_empresa: rut_empresa}
    });
      
      if (!empresa) {
        return res.status(401).json({ message: 'No existe Empresa' });
      }
  
      // Crea un token JWT con la información si es necesario
  
      // Devuelve el token y otros datos si es necesario
      res.status(200).json(empresa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar Empresa' });
    }
};
//LISTO
// exports.agregarEmpresa = async (req, res) => {
//   try {
 
//     const { rut_empresa, cod_departamento, nom_departamento, email_departamento, rut_jefe_departamento } = req.body;

//     if (!rut_empresa || !cod_departamento) {
//       return res.status(400).json({ mensaje: 'Se requieren rut_empresa y cod_departamento' });
//     }
    
//     const nuevoEmpresa = new Empresa({
//       rut_empresa,
//       cod_departamento,
//       nom_departamento,
//       email_departamento,
//       rut_jefe_departamento,
//     });

//     await nuevoEmpresa.save();

//     res.status(201).json({ mensaje: 'Empresa agregado con éxito' });
//   } catch (error) {
    
//     console.error(error);
//     res.status(500).json({ mensaje: 'Error al agregar el departamento' });
//   }
// };
//LISTO

// exports.bajaEmpresa = async (req, res) => {
//   try {
//     let { id_empresa } = req.body;

//     // Convertir rut_empresa a cadena si es un número
//     id_empresa = String(id_empresa);

//     // // Verificar si rut_empresa y cod_departamento están definidos
//     // if (!rut_empresa || cod_departamento === undefined) {
//     //   return res.status(400).json({ mensaje: 'Se requieren rut_empresa y cod_departamento' });
//     // 
  
//     // Dar de baja departamento
//     const resultado = await Empresa.update( {cod_estado:'B'},{
//       where: { id_empresa : id_empresa}
//     }).then(numFilasActualizadas => {
//       console.log(`${numFilasActualizadas} filas`);

//     });

//     if (resultado === 0) {
//       return res.status(404).json({ mensaje: 'Empresa no encontrado' });
//     }

//     res.status(200).json({ mensaje: 'Empresa cambiado con éxito' });
//   } catch (error) {
//     console.error('Error al eliminar el departamento:', error);
//     res.status(500).json({ mensaje: 'Error al eliminar el departamento', error: error.message });
//   }
// };
//LISTO

exports.modificarEmpresa = async(req, res) => {

}
 