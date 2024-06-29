const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
const { OrdenPedidoDetalle } = require('../models/OrdenPedidoDetalleModel');
const {CategoriaProducto} = require('./CategoriaProductoModel');
const {OrdenCompraDetalle} = require('./OrdenCompraDetalleModel');

class Producto extends Model {} 

Producto.init({
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  rut_empresa: {
    type: DataTypes.STRING(12),
    allowNull: false,
  },
  id_categoria_productos_fk: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_producto: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
    sequelize,
    modelName: 'productos', // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'productos'

});

// Define relaciones si es necesario
// Producto.belongsTo(Empresa, { foreignKey: 'rut_empresa' });
OrdenPedidoDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
});
Producto.hasMany(OrdenPedidoDetalle, {
  foreignKey: 'id_producto',
  as: 'detallesProductos',
});
CategoriaProducto.hasMany(Producto, {
  foreignKey: 'id_categoria_productos_fk',
  as:  'productos'
});
Producto.belongsTo(CategoriaProducto, {
  foreignKey:'id_categoria_productos_fk',
  as: 'categoria'
});

OrdenCompraDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  target: 'id_producto',
  as: 'producto',
});
Producto.hasMany(OrdenCompraDetalle, {
  foreignKey: 'id_producto',
  target: 'id_producto',
  as: 'producto',
});
// OrdenCompraDetalle.hasMany(Producto, {
//   foreignKey: 'id_producto',
//   target: 'id_producto',
//   as: 'producto',
// });
// Producto.belongsTo(OrdenCompraDetalle, {
//   foreignKey: 'id_producto',
//   target: 'id_producto',
//   as: 'producto',
// });

module.exports = { Producto };
