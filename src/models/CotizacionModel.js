const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/db.sequelize');
const DetalleCotizacion = require('./DetalleCotizacionModel'); // Importa el modelo de DetalleCotizacion
const {Producto} = require('./ProductoModel'); // Importa el modelo de DetalleCotizacion

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
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Cotizacion',
  timestamps: false,
  tableName: 'cotizaciones'
});

// Asocia Cotizacion con DetalleCotizacion
Cotizacion.hasMany(DetalleCotizacion, {
  foreignKey: 'id_cotizacion_fk',
  as: 'detalles', // Nombre de la relación
});
DetalleCotizacion.belongsTo(Producto, {
  foreignKey: 'id_producto', // Campo en DetalleCotizacion que referencia el ID del producto
  as: 'producto', // Alias para acceder a los datos del producto
});
module.exports = Cotizacion;
