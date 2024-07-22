const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/db.sequelize');
const DetalleCotizacion = require('./DetalleCotizacionModel');
const Producto = require('./ProductoModel');

class Cotizacion extends Model {}

Cotizacion.init({
  id_cotizacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado_seguimiento: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  rut_empresa: {
    type: DataTypes.STRING(12),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Cotizacion',
  timestamps: false,
  tableName: 'cotizaciones'
});


Cotizacion.associate = function(models) {
  Cotizacion.hasMany(models.DetalleCotizacion, { as: 'detalles', foreignKey: 'cotizacionId' });
};
module.exports = Cotizacion;
