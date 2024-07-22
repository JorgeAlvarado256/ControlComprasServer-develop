const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
//const { OrdenPedidoCabecera } = require('../models/OrdenPedidoCabeceraModel')
//const { Producto } = require('../models/ProductoModel')

class OrdenPedidoDetalle extends Model {}

OrdenPedidoDetalle.init(
  {
    id_orden_pedido_detalle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad_solicitada: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad_comprada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    cantidad_recepcionada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    estado_seguimiento_producto: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    id_orden_pedido_cabecera_fk: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orden_compra_detalle_fk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'orden_pedido_detalle',
    timestamps: false,
    tableName: 'orden_pedido_detalle',
  }

  
);


module.exports = { OrdenPedidoDetalle };
