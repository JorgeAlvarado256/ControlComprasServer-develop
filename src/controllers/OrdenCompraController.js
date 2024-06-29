const express = require('express');
const router = express.Router();
const sequelize = require('../../config/db.sequelize');

const { OrdenCompraCabecera } = require('../models/OrdenCompraCabeceraModel');
const { OrdenCompraDetalle } = require('../models/OrdenCompraDetalleModel');
const { OrdenPedidoDetalle } = require('../models/OrdenPedidoDetalleModel');
const { Producto } = require('../models/ProductoModel')
const { Usuario } = require('../models/UsuarioModel')
const { Departamento } = require('../models/DepartamentoModel')
const { Empresa } = require('../models/EmpresaModel')

exports.guardarOrdenCompra = async (req, res) => {

    const transaction = await sequelize.transaction();
  
    try {
  
      // Data de cabecera
      const { 
        rut_empresa,
        rut_proveedor,
        rut_usuario,
        fecha_emision,
        estado_seguimiento,
        neto,
        iva,
        total_compra,
        ordenCompraDetalle
      } = req.body;
      const ordenCabeceraData = {
        rut_empresa,
        rut_proveedor,
        rut_usuario,
        fecha_emision,
        estado_seguimiento,
        neto,
        iva,
        total_compra,
      }
      console.log("total_compra: " + total_compra);
      // Crear cabecera
      const ordenCabecera = await OrdenCompraCabecera.create(ordenCabeceraData, {transaction});

      // Extraer id de cabecera creada
      const id_orden_compra_cabecera_fk = ordenCabecera.id_orden_compra_cabecera;
  
      const detallesCreados = [];
      let noUpdate = 0;
      for(let detalle of ordenCompraDetalle) {
  
        detalle.id_orden_compra_cabecera_fk = id_orden_compra_cabecera_fk; 
        console.log("Capturando id_orden_compra_cabecera_fk: "+detalle.id_orden_compra_cabecera_fk +" "+detalle.rut_empresa);
        const ordenDetalle = await OrdenCompraDetalle.create(
          detalle,
          {transaction}  
        );
        const orden_compra_detalle_fk = ordenDetalle.id_orden_compra_detalle;
        const detalleActualizado = await OrdenPedidoDetalle.update(
          {orden_compra_detalle_fk},
          {
            where: {
              id_orden_pedido_detalle: detalle.id_orden_pedido_detalle
            },
            transaction: transaction
          }
        );
        
        detallesCreados.push(ordenDetalle);
        noUpdate = detalleActualizado;
      }
      if (noUpdate === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: 'No se actualizó el id_pedido_detalle' });
      }
      await transaction.commit();
  
      res.status(201).json({
        msg: 'Orden creada',
        data: detallesCreados  
      });
      console.log('Ordenes creadas: ' + detallesCreados);
  
    } catch (error) {
      await transaction.rollback();
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
      }
  
      console.error(`Error al crear las órdenes: ${error.message}`, error);
      res.status(500).json({ error: 'Error al crear las órdenes', detalle: error.message });
    }
};
exports.obtenerOrdenesDeCompraAdquisidor = async (req, res) => {
  try {
    const { rut_usuario } = req.body;
    const usuario = await Usuario.findOne({
      attributes: ['id_departamento','rut_empresa','cod_rol'], 
      where:{rut_usuario: rut_usuario}
    })
    const id_departamento = usuario.id_departamento;
    const rut_empresa = usuario.rut_empresa;
    // const cod_rol = usuario.cod_rol;

    const pedidos = await OrdenCompraCabecera.findAll({
      where: { rut_usuario: rut_usuario },
      include: [//INNER JOIN 1
      {
        model: OrdenCompraDetalle,
        required: true,
        as: 'detalles',
        include: [//INNER JOIN 2
        {
          model: Producto,
          required: true,
          as: 'producto'
        }],
        // include: [//INNER JOIN 3
        // {
        //   model: OrdenPedidoDetalle,
        //   required: true,
        //   as: 'pedidosDetalles'
        // }],
      },
      {//INNER JOIN 4
        model: Usuario,
        required: true,
        as: 'usuario',
        include: [//INNER JOIN 5
        {
          model: Departamento,
          required: true,
          as: 'departamento',
          where: { id_departamento: id_departamento },
          include: [//INNER JOIN 6
          {
            model: Empresa,
            required: true,
            as: 'empresa',
            where: { rut_empresa: rut_empresa },
          }]
        }],
      },
    ]});
    res.status(200).json({ pedidos });
  } catch (error) {
    console.error(`Error al obtener las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al obtener las órdenes', detalle: error.message });
  }
};
exports.obtenerOrdenesDeCompraGerencia = async (req, res) => {
  try {
    const { rut_usuario } = req.body;
    const usuario = await Usuario.findOne({
      attributes: ['id_departamento','rut_empresa','cod_rol'], 
      where:{rut_usuario: rut_usuario}
    })
    const rut_empresa = usuario.rut_empresa;
    const pedidos = await OrdenCompraCabecera.findAll({
      include: [//INNER JOIN 1
      {
        model: OrdenCompraDetalle,
        required: true,
        as: 'detalles',
        include: [//INNER JOIN 2
        {
          model: Producto,
          required: true,
          as: 'producto'
        }],
      },
      {//INNER JOIN 4
        model: Usuario,
        required: true,
        as: 'usuario',
        include: [//INNER JOIN 5
        {
          model: Departamento,
          required: true,
          as: 'departamento',
          include: [//INNER JOIN 6
          {
            model: Empresa,
            required: true,
            as: 'empresa',
            where: { rut_empresa: rut_empresa },
          }]
        }],
      },
    ]});
    res.status(200).json({ pedidos });
  } catch (error) {
    console.error(`Error al obtener las órdenes: ${error.message}`, error);
    res.status(500).json({ error: 'Error al obtener las órdenes', detalle: error.message });
  }
};
exports.actualizarCompraDetalleAdquisidor = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción
  try {
    const { compraDetalle } = req.body;
    const detallesActualizados = [];
    const detallesEliminados = [];
    for (const detalle of compraDetalle) {
      const {
        id_orden_compra_detalle,
        id_orden_compra_cabecera_fk,
        precio_unitario
      } = detalle;

      const cantidad_solicitada = await OrdenPedidoDetalle.findOne({
        attributes: ['cantidad_solicitada'],
        where: { orden_compra_detalle_fk: id_orden_compra_detalle }
      });
      console.log('cantidad_solicitada:', cantidad_solicitada.cantidad_solicitada);

      const precio_total_item = precio_unitario * cantidad_solicitada.cantidad_solicitada;
      console.log('precio_total_item:', precio_total_item);
      const detalleData = {
        id_orden_compra_detalle,
        precio_unitario,
        precio_total_item
      };

      const detalleActualizado = await OrdenCompraDetalle.update(
        detalleData,
        {
          where: {
            id_orden_compra_detalle: id_orden_compra_detalle
          },
          transaction: transaction
        }
      );
      if (detalleActualizado)
        detallesActualizados.push(detalleActualizado);
      console.log('detalleActualizado:', detalleActualizado);

      const detalleEliminado = await OrdenCompraDetalle.destroy(
      {
        where: {
          precio_unitario: 0,
          id_orden_compra_detalle: id_orden_compra_detalle
        },
        transaction: transaction
      });
      if (detalleEliminado)
      {  
        detallesEliminados.push(detalleEliminado);
        console.log('Compra actualizada:', detalleEliminado);
      }
    }
    const totalCompra = await OrdenCompraDetalle.sum('precio_total_item', {
      where: {
        id_orden_compra_cabecera_fk: compraDetalle[0].id_orden_compra_cabecera_fk
      },
      transaction: transaction
    });
    console.log('totalCompra: ', totalCompra);
    const actualizarTotalCompra = await OrdenCompraCabecera.update(
      { total_compra: totalCompra,
        estado_seguimiento: 'PENRC'
      },
      {
        where: {
          id_orden_compra_cabecera: compraDetalle[0].id_orden_compra_cabecera_fk
        },
        transaction: transaction
      });
      console.log('actualizarTotalCompra: ', actualizarTotalCompra);
    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    console.log('Compras actualizadas:', detallesActualizados, actualizarTotalCompra);
    if(detallesActualizados>0)
      res.status(200).json({mensaje:'Ordenes de Compra actualizados correctamente: ' + detallesActualizados});
    else
      res.status(200).json({mensaje:'No se actualizó ninguna órden'});
  } catch (error) {
    await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
    }

    console.error(`Error al actualizar: ${error.message}`, error);
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }

};
exports.anularOrdenCabecera = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción
  try {
    const { id_orden_compra_cabecera } = req.body;
    const ordenDetalleEliminado = await OrdenCompraDetalle.destroy({
      where: { id_orden_compra_cabecera_fk: id_orden_compra_cabecera },
      transaction: transaction
    });
    const ordenCabeceraEliminada = await OrdenCompraCabecera.destroy({
      where: { id_orden_compra_cabecera: id_orden_compra_cabecera },
      transaction: transaction
    });

    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    console.log('Orden eliminada:', ordenCabeceraEliminada, ordenDetalleEliminado);
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
exports.actualizarEstadoCompra = async (req, res) => {
  const transaction = await sequelize.transaction();
  try{
    const { id_orden_compra_cabecera, estado_seguimiento } = req.body;
    const estado_seguimiento_producto = estado_seguimiento;

    const updateDataDetalle = { estado_seguimiento_producto }
    const updateData = { estado_seguimiento }
    console.log('estado_seguimiento: ' + estado_seguimiento);
    console.log('estado_seguimiento_producto: ' + estado_seguimiento_producto);
    const estadoSeguimientoActualizado = await OrdenCompraCabecera.update(updateData,
      {
        where: {
          id_orden_compra_cabecera: id_orden_compra_cabecera
        },
        transaction: transaction
      });
      const estadoSeguimientoProductoActualizado = await OrdenPedidoDetalle.update(updateDataDetalle,
        {
          where: {
            orden_compra_detalle_fk: id_orden_compra_cabecera
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
};
exports.aprobarCompra = async (req, res) => {
  const transaction = await sequelize.transaction();
  try{
    const datosParams = req.body;
    console.log('datosParams.id_orden_compra_cabecera: ' + datosParams.id_orden_compra_cabecera);
    const compraAprobada = await OrdenCompraCabecera.update(datosParams,
      {
        where: {
          id_orden_compra_cabecera: datosParams.id_orden_compra_cabecera
        },
        transaction: transaction
      });

      await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

      console.log('Compra Aprobada:', compraAprobada);
      res.status(200).json({mensaje:'Compra Aprobada correctamente'});
    } 
    catch (error) {
      await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción
  
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
      }
  
      console.error(`Error al aprobar Compra: ${error.message}`, error);
      res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
    }
};
exports.confirmarCompraAdquisidor = async (req, res) => {
  const transaction = await sequelize.transaction(); // Iniciamos una transacción
  try {
    const { compraDetalle } = req.body;
    for (const detalle of compraDetalle.detalles) {
      const { 
        cantidad_recepcionada, 
        id_orden_compra_detalle
      } = detalle;

      const actualizarDetalleCompra = await OrdenCompraDetalle.update(
        {
          cantidad_recepcionada: cantidad_recepcionada
        },
        {
          where: {
            id_orden_compra_detalle: id_orden_compra_detalle
          },
          transaction: transaction
        }
      );
      console.log('actualizarDetalleCompra: ', actualizarDetalleCompra);
      const actualizarDetallePedido = await OrdenPedidoDetalle.update(
        {
          cantidad_recepcionada: cantidad_recepcionada,
          estado_seguimiento_producto: 'COMCC'
        },
        {
          where: {
            orden_compra_detalle_fk: id_orden_compra_detalle
          },
          transaction: transaction
        }
      );
      console.log('actualizarDetallePedido: ', actualizarDetallePedido);
    }
    const actualizarEstadoCompra = await OrdenCompraCabecera.update(
      { 
        estado_seguimiento: 'COMCC'
      },
      {
        where: {
          id_orden_compra_cabecera: compraDetalle.id_orden_compra_cabecera
        },
        transaction: transaction
      });
    console.log('actualizarEstadoCompra: ', actualizarEstadoCompra);
    await transaction.commit(); // Confirmar la transacción si todas las operaciones fueron exitosas

    if(actualizarEstadoCompra>0)
      res.status(200).json({mensaje:'Ordenes de Compra actualizados correctamente: ' + actualizarEstadoCompra});
    else
      res.status(200).json({mensaje:'No se actualizó ninguna órden'});
  } catch (error) {
    await transaction.rollback(); // Si ocurre un error, deshacer los cambios realizados en la transacción

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Error de validación', detalles: error.errors });
    }

    console.error(`Error al actualizar: ${error.message}`, error);
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }

};