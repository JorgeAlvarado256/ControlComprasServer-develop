const express = require('express');
const router = express.Router();

const { OrdenPedidoCabecera } = require('../models/OrdenPedidoCabeceraModel');

exports.GuardarOrdenPedidoCabecera = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud (req.body)
    const {
      rut_empresa,
      rut_usuario,
      fecha_emision,
      estado_seguimiento,
      rut_autoriza,
      hora_fecha_autoriza,
      observaciones_solicitante,
      observaciones_jefe_area,
      cod_rol // Se asume que cod_rol se recibe en req.body
    } = req.body;

    // Crear un objeto con los datos de la orden
    const ordenData = {
      rut_empresa,
      rut_usuario,
      fecha_emision,
      estado_seguimiento,
      rut_autoriza,
      hora_fecha_autoriza,
      observaciones_solicitante,
      observaciones_jefe_area
    };

    // Lógica específica para el rol de jefetura (cod_rol = 4)
    if (cod_rol === 4) {
      // Agregar campos adicionales para los pedidos de jefes de área
      ordenData.aprobacion_jefe_area = true;
      ordenData.nivel_aprobacion = 'Jefetura';
      // Puedes agregar más campos específicos según sea necesario
    }

    // Crear la orden en la base de datos usando el modelo OrdenPedidoCabecera
    const ordenCreada = await OrdenPedidoCabecera.create(ordenData);

    // Log para verificar la orden creada
    console.log('Orden creada dinámicamente:', ordenCreada.toJSON());

    // Respuesta exitosa con el ID de la orden creada
    res.status(201).json({
      mensaje: 'Orden de Pedido creada exitosamente',
      id_orden_pedido_cabecera: ordenCreada.id_orden_pedido_cabecera
    });
  } catch (error) {
    // Manejo de errores
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', mensaje: error.errors });
    }
    console.error(`Error al crear la orden: ${error.message}`, error);
    res.status(500).json({ error: 'Error al crear la orden', mensaje: error.message });
  }
};
