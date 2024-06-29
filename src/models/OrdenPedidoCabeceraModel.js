const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
const { OrdenPedidoDetalle } = require('../models/OrdenPedidoDetalleModel');
const { Usuario } = require('./UsuarioModel');
const {Empresa} = require('./EmpresaModel');
const {Producto} = require('./ProductoModel');
class OrdenPedidoCabecera extends Model {}

OrdenPedidoCabecera.init(
  {
    id_orden_pedido_cabecera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    rut_usuario:  {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado_seguimiento: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    rut_autoriza: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    nombre_autoriza: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    hora_fecha_autoriza: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    observaciones_solicitante: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    observaciones_jefe_area: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'orden_pedido_cabecera',
    timestamps: false,
    tableName: 'orden_pedido_cabecera'

  }
);
OrdenPedidoCabecera.hasMany(OrdenPedidoDetalle, {
  foreignKey: 'id_orden_pedido_cabecera_fk',
  as: 'detalles',
});
OrdenPedidoDetalle.belongsTo(OrdenPedidoCabecera, {
  foreignKey: 'id_orden_pedido_cabecera_fk',
  as: 'cabecera',
});
OrdenPedidoCabecera.belongsTo(Usuario, {
  foreignKey: 'rut_usuario',
  targetKey: 'rut_usuario',
  as: 'usuario',
});
OrdenPedidoCabecera.belongsTo(Empresa, {
  foreignKey: 'rut_empresa',
  as: 'empresa',
});
Empresa.hasMany(OrdenPedidoCabecera, {
  foreignKey: 'rut_empresa',
  as: 'pedidoCabecera',
});
Usuario.hasMany(OrdenPedidoCabecera, {
  foreignKey: 'rut_usuario',
  targetKey: 'rut_usuario',
  as: 'pedidoCabecera',
});
// OrdenPedidoCabecera.belongsTo(Producto, {
//   foreignKey: 'id_producto',
//   as: 'producto',
// });
// Producto.hasMany(OrdenPedidoCabecera, {
//   foreignKey: 'id_producto',
//   as: 'detallesProductos',
// });

module.exports = { OrdenPedidoCabecera };
