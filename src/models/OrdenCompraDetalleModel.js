const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
// const {Producto} = require('./ProductoModel');

class OrdenCompraDetalle extends Model {}

OrdenCompraDetalle.init(
  {
    id_orden_compra_detalle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    id_orden_compra_cabecera_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad_comprada: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio_unitario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio_total_item: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad_recepcionada: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'orden_compra_detalle',
    timestamps: false,
    tableName: 'orden_compra_detalle'
  }
);

module.exports = { OrdenCompraDetalle };
