const express = require('express');
const router = express.Router();
const sequelize = require('../../config/db.sequelize');
const { Op } = require('sequelize');

const { OrdenPedidoDetalle } = require('../models/OrdenPedidoDetalleModel');
const { OrdenPedidoCabecera } = require('../models/OrdenPedidoCabeceraModel')
const { Producto } = require('../models/ProductoModel')
const { Usuario } = require('../models/UsuarioModel')
const { Departamento } = require('../models/DepartamentoModel')
const { Empresa } = require('../models/EmpresaModel')
const { CategoriaProducto } = require('../models/CategoriaProductoModel')

exports.obtenerPedidosJefatura = async (req, res) => {
  try {
    const { id_departamento, rut_empresa } = req.body;
    const pedidos = await OrdenPedidoCabecera.findAll({
      include: [//INNER JOIN 1
        {
          model: OrdenPedidoDetalle,
          required: true,
          as: 'detalles',
          include: [//INNER JOIN 2
            {
              model: Producto,
              required: true,
              as: 'producto'
            },
          ],
        },
        {//INNER JOIN 3
          model: Usuario,
          required: true,
          as: 'usuario',
          include: [//INNER JOIN 4
            {
              model: Departamento,
              as: 'departamento',
              where: { id_departamento: id_departamento },
              include: [//INNER JOIN 5
                {
                  model: Empresa,
                  required: true,
                  as: 'empresa',
                  where: { rut_empresa: rut_empresa },
                }
              ]
            },
          ],
        },
      ],
    });
    res.status(200).json({ pedidos });
  } catch (error) {
    console.error(`Error al obtener las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al obtener las órdenes', detalle: error.message });
  }
};
exports.actualizarEstadoPedido = async (req, res) => {
  const transaction = await sequelize.transaction();
  try{
    const { id_orden_pedido_cabecera, estado_seguimiento } = req.body;
    const estado_seguimiento_producto = estado_seguimiento;

    const updateDataDetalle = { estado_seguimiento_producto }
    const updateData = { estado_seguimiento }
    console.log('estado_seguimiento: ' + estado_seguimiento);
    console.log('estado_seguimiento_producto: ' + estado_seguimiento_producto);
    const estadoSeguimientoActualizado = await OrdenPedidoCabecera.update(updateData,
      {
        where: {
          id_orden_pedido_cabecera: id_orden_pedido_cabecera
        },
        transaction: transaction
      });
      const estadoSeguimientoProductoActualizado = await OrdenPedidoDetalle.update(updateDataDetalle,
        {
          where: {
            id_orden_pedido_cabecera_fk: id_orden_pedido_cabecera
          },
          transaction: transaction
        });

      await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

      console.log('Estado actualizado:', estadoSeguimientoActualizado, estadoSeguimientoProductoActualizado);
      res.status(200).json({mensaje:'Estado actualizado correctamente'});
    } 
    catch (error) {
      await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción
  
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
      }
  
      console.error(`Error al actualizar Estado Seguimiento: ${error.message}`, error);
      res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
    }
}
exports.GuardarOrdenPedidoDetalle = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción

  try {
    const {
      rut_empresa,
      rut_usuario,
      fecha_emision,
      estado_seguimiento,
      rut_autoriza,
      hora_fecha_autoriza,
      observaciones_solicitante,
      observaciones_jefe_area,
      pedidoDetalle
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

    const ordenCreada = await OrdenPedidoCabecera.create(ordenData, { transaction: transaction });

    const id_orden_pedido_cabecera_fk = ordenCreada.id_orden_pedido_cabecera;
    
    const ordenesCreadas = [];

    for (const orden of pedidoDetalle) {
      const {
        id_producto,
        cantidad_solicitada,
        cantidad_comprada,
        cantidad_recepcionada,
        // estado_seguimiento_producto,
      } = orden;
      const estado_seguimiento_producto = estado_seguimiento
      const ordenData = {
        id_producto,
        cantidad_solicitada,
        cantidad_comprada,
        cantidad_recepcionada,
        estado_seguimiento_producto,
        id_orden_pedido_cabecera_fk,
      };

      const ordenCreada = await OrdenPedidoDetalle.create(ordenData, { transaction: transaction });
      ordenesCreadas.push(ordenCreada.toJSON());
    }

    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    console.log('Órdenes creadas dinámicamente:', ordenesCreadas);
    res.status(201).json({ ordenesCreadas });
  } catch (error) {
    await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
    }

    console.error(`Error al crear las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al crear las órdenes', detalle: error.message });
  }
};
exports.actualizarPedidoDetalleSolicitante = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción
  try {
    const {
      pedidoDetalle
    } = req.body;
    const detallesActualizados = [];
    const detallesEliminados = [];
    for (const detalle of pedidoDetalle) {
      const {
        id_orden_pedido_detalle,
        cantidad_solicitada
      } = detalle;

      const detalleData = {
        id_orden_pedido_detalle,
        cantidad_solicitada
      };

      const detalleActualizado = await OrdenPedidoDetalle.update(
        detalleData,
        {
          where: {
            id_orden_pedido_detalle: id_orden_pedido_detalle
          },
          transaction: transaction
        }
      );
      if (detalleActualizado)
        detallesActualizados.push(detalleActualizado);
      console.log('Pedido actualizado:', detalleActualizado);

      const detalleEliminado = await OrdenPedidoDetalle.destroy(
      {
        where: {
          cantidad_solicitada: 0
        },
        transaction: transaction
      });
      if (detalleEliminado)
        detallesEliminados.push(detalleEliminado);
      console.log('Pedido actualizado:', detalleActualizado);

    }
    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    console.log('Pedidos actualizados:', detallesActualizados);
    res.status(200).json({mensaje:'Pedidos actualizados correctamente'});
  } catch (error) {
    await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
    }

    console.error(`Error al crear las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }

}
exports.actualizarPedidoDetalleJefatura = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción
  try {
    const { pedidoDetalle, pedidoCabecera } = req.body;
    const detallesActualizados = [];
    const detallesEliminados = [];

    const { 
      id_orden_pedido_cabecera, 
      observaciones_jefe_area, 
      estado_seguimiento, 
      rut_autoriza, 
      nombre_autoriza, 
      hora_fecha_autoriza 
    } = pedidoCabecera;

    const dataCabecera = { 
      id_orden_pedido_cabecera, 
      observaciones_jefe_area, 
      estado_seguimiento, 
      rut_autoriza, 
      nombre_autoriza, 
      hora_fecha_autoriza 
    };

    const observacionActualizada = await OrdenPedidoCabecera.update(dataCabecera,{
      where: {
        id_orden_pedido_cabecera: id_orden_pedido_cabecera
      },
      transaction: transaction
    });
    if (observacionActualizada)
      console.log('Observación_jefatura actualizada: ' + observaciones_jefe_area, observacionActualizada);

    for (const detalle of pedidoDetalle) {
      const {
        id_orden_pedido_detalle,
        cantidad_solicitada
      } = detalle;
      
      const detalleData = {
        id_orden_pedido_detalle,
        cantidad_solicitada,
      };
      console.log('estado_seguimiento_producto: '+ estado_seguimiento_producto);
      const detalleActualizado = await OrdenPedidoDetalle.update(
        detalleData,
        {
          where: {
            id_orden_pedido_detalle: id_orden_pedido_detalle
          },
          transaction: transaction
        }
      );
      if (detalleActualizado)
        detallesActualizados.push(detalleActualizado);
      console.log('Pedido actualizado:', detalleActualizado);

      const detalleEliminado = await OrdenPedidoDetalle.destroy(
      {
        where: {
          cantidad_solicitada: 0
        },
        transaction: transaction
      });
      if (detalleEliminado)
        detallesEliminados.push(detalleEliminado);
      console.log('Pedido actualizado:', detalleActualizado);

    }
    const estado_seguimiento_producto = estado_seguimiento;
    const updateDataDetalle = { estado_seguimiento_producto }
    const estadoSeguimientoProductoActualizado = await OrdenPedidoDetalle.update(updateDataDetalle,
    {
      where: {
        id_orden_pedido_cabecera_fk: id_orden_pedido_cabecera
      },
      transaction: transaction
    });

    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    console.log('Pedidos actualizados:', detallesActualizados);
    console.log('Estados actualizados:', estadoSeguimientoProductoActualizado);
    res.status(200).json({mensaje:'Pedidos actualizados correctamente', 
                          observacionActualizada: observacionActualizada, 
                          detallesActualizados: detallesActualizados,
                          detallesEliminados: detallesEliminados,
                          estadoSeguimientoProductoActualizado: estadoSeguimientoProductoActualizado
                         });
  } catch (error) {
    await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
    }

    console.error(`Error al crear las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }

}
exports.obtenerPedidosUsuario = async (req, res) => {
  try {
    const { rut_usuario } = req.body;
    const pedidos = await OrdenPedidoCabecera.findAll({
      where: { rut_usuario },
      include: [
        {
          model: OrdenPedidoDetalle,
          required: true,
          as: 'detalles',
          include: [
            {
              model: Producto,
              required: true,
              as: 'producto'
            },
          ],
        },
      ],
    });
    res.status(200).json({ pedidos });
  } catch (error) {
    console.error(`Error al obtener las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al obtener las órdenes', detalle: error.message });
  }
};
exports.anularOrdenPedido = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción
  try {
    const { id_orden_pedido_cabecera } = req.body;

    const ordenEliminada = await OrdenPedidoCabecera.destroy({
      where: { id_orden_pedido_cabecera: id_orden_pedido_cabecera },
      transaction: transaction
    });

    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    console.log('Orden eliminada:', ordenEliminada);
    res.status(200).json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
    }

    console.error(`Error al eliminar la orden: ${error.message}`, error);
    res.status(500).json({ error: 'Error al eliminar la orden', detalle: error.message });
  }
};
exports.ActualizarOrdenesPedido = async (req, res) => {
  try {
    const {
      codigo_producto,
      cantidad_solicitada,
      cantidad_comprada,
      cantidad_recepcionada,
      estado_seguimiento_producto,
      id_orden_compra_cabecera,
      rut_empresa,
    } = req.body;

    const updatedOrden = await OrdenPedidoDetalle.update(
      {
        cantidad_solicitada,
        cantidad_comprada,
        cantidad_recepcionada,
        estado_seguimiento_producto,
        id_orden_compra_cabecera,
      },
      {
        where: {
          codigo_producto,
          rut_empresa,
        },
      }
    );

    if (updatedOrden[0] === 0) {
      return res.status(404).json({ error: 'No se encontró la orden para actualizar' });
    }

    res.status(200).json({ mensaje: 'Orden actualizada exitosamente' });
  } catch (error) {
    console.error(`Error al actualizar la orden: ${error.message}`, error);
    res.status(500).json({ error: 'Error al actualizar la orden', detalle: error.message });
  }
};

exports.obtenerPedidosAprobados = async (req, res) => {
  try {
    const rut_empresa = req.body.rut_empresa;
    const pedidos = await OrdenPedidoDetalle.findAll({ 
      //estado: { $in: ['APRC', 'APRO'] },
      where:{
        orden_compra_detalle_fk: null,
        estado_seguimiento_producto: { [Op.in]: ['APRC', 'APRO'] }
      },
      include: [{ 
        model: Producto,
        required: true,
        as: 'producto',
        include: [{
          model: CategoriaProducto,
          required: true,
          as: 'categoria',
        }],
        where: { rut_empresa: rut_empresa }
      }],
    });
    res.json({pedidos});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los pedidos aprobados' });
  }
};