const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/db.sequelize');
const {CategoriaProducto }= require('./CategoriaProductoModel');
const {OrdenPedidoDetalle }= require('./OrdenPedidoDetalleModel');
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
  modelName: 'Producto',
  timestamps: false,
  tableName: 'productos'
});

// Relaciones

Producto.associate = function(models) {
  Producto.belongsTo(models.CategoriaProducto, { as: 'categoria', foreignKey: 'categoriaId' });
};

Producto.belongsTo(CategoriaProducto, {
  foreignKey: 'id_categoria_productos_fk',
  as: 'categoria'
});

CategoriaProducto.hasMany(Producto, {
  foreignKey: 'id_categoria_productos_fk',
  as: 'productos'
});

Producto.hasMany(OrdenPedidoDetalle, {
  foreignKey: 'id_producto',
  as: 'ordenPedidoDetalles'
});

OrdenPedidoDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

Producto.hasMany(OrdenCompraDetalle, {
  foreignKey: 'id_producto',
  as: 'ordenCompraDetalles'
});

OrdenCompraDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

module.exports = Producto;
