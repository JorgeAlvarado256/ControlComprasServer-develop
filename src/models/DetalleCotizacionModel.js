const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/db.sequelize');
const Cotizacion = require('./CotizacionModel');
const Producto = require('./ProductoModel');

class DetalleCotizacion extends Model {}

DetalleCotizacion.init({
  id_detalle_cotizacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  id_cotizacion_fk: {
    type: DataTypes.INTEGER,
    references: {
      model: 'cotizaciones',
      key: 'id_cotizacion'
    },
    allowNull: false,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_proveedores: {
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
  },
  cantidad_recepcionada: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  estado_seguimiento_producto: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  id_orden_pedido_cabecera_fk: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'DetalleCotizacion',
  tableName: 'detalle_cotizaciones',
  timestamps: false,
});

DetalleCotizacion.associate = function(models) {
  DetalleCotizacion.belongsTo(models.Cotizacion, { as: 'cotizacion', foreignKey: 'cotizacionId' });
  DetalleCotizacion.belongsTo(models.Producto, { as: 'producto', foreignKey: 'productoId' });
};

module.exports = DetalleCotizacion;
