const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
const { Proveedor } = require('./ProveedorModel');
const {OrdenCompraDetalle} = require('./OrdenCompraDetalleModel');
const {Producto} = require('./ProductoModel');
const {Usuario} = require('./UsuarioModel');
const {OrdenPedidoDetalle} = require('./OrdenPedidoDetalleModel');

// Definición de la tabla OrdenCompraCabecera
class OrdenCompraCabecera extends Model {}

OrdenCompraCabecera.init(
  {
    id_orden_compra_cabecera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    rut_proveedor: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    rut_usuario: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado_seguimiento: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    neto: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    iva: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    total_compra: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    rut_autoriza: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    nombre_autoriza: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    hora_fecha_autoriza: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    observaciones_adquisiciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    observaciones_gerencia: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'orden_compra_cabecera',
    timestamps: false,
    tableName: 'orden_compra_cabecera'
  }
);
OrdenCompraCabecera.belongsTo(Proveedor, {
  foreignKey: 'rut_proveedor',
  targetKey: 'rut_proveedor',
  onDelete: 'CASCADE',
});
Proveedor.hasMany(OrdenCompraCabecera, {
  foreignKey: 'rut_proveedor',
  targetKey: 'rut_proveedor',
  onDelete: 'CASCADE',
})
OrdenCompraDetalle.belongsTo(OrdenCompraCabecera, {
  foreignKey: 'id_orden_compra_cabecera_fk',
  // targetKey: 'id_orden_compra_cabecera_fk',
  as:'cabecera'
});
OrdenCompraCabecera.hasMany(OrdenCompraDetalle, {
  foreignKey: 'id_orden_compra_cabecera_fk',
  // targetKey: 'id_orden_compra_cabecera_fk',
  as:'detalles'
})
OrdenCompraCabecera.belongsTo(Usuario, {
  foreignKey: 'rut_usuario',
  targetKey: 'rut_usuario',
  as: 'usuario',
});
Usuario.hasMany(OrdenCompraCabecera, {
  foreignKey: 'rut_usuario',
  targetKey: 'rut_usuario',
  as: 'usuario',
});

OrdenCompraDetalle.hasMany(OrdenPedidoDetalle, {
  foreignKey: 'orden_compra_detalle_fk',
  // targetKey: 'orden_compra_detalle_fk',
  as: 'pedidosDetalles',
});
OrdenPedidoDetalle.belongsTo(OrdenCompraDetalle, {
  foreignKey: 'orden_compra_detalle_fk',
  // targetKey: 'orden_compra_detalle_fk',
  as: 'pedidosDetalles',
});

module.exports = { OrdenCompraCabecera };
