const express = require('express');
const router = express.Router();

const { OrdenPedidoCabecera } = require('../models/OrdenPedidoCabeceraModel');

exports.GuardarOrdenPedidoCabecera = async (req, res) => {
    try {
      const {
        rut_empresa,
        rut_usuario,
        fecha_emision,
        estado_seguimiento,
        rut_autoriza,
        hora_fecha_autoriza,
        observaciones_solicitante,
        observaciones_jefe_area
      } = req.body;
  
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
  
      const ordenCreada = await OrdenPedidoCabecera.create(ordenData);
  
      console.log('Orden creada dinámicamente:', ordenCreada.toJSON());
  
      res.status(201).json({ mensaje: 'Orden de Pedido creada exitosamente', id_orden_pedido_cabecera: ordenCreada.id_orden_pedido_cabecera });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Error de validación', mensaje: error.errors });
      }
      console.error(`Error al crear la orden: ${error.message}`, error);
      res.status(500).json({ error: 'Error al crear la orden', mensaje: error.message });
    }
  };