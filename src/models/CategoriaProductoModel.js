const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
const { Producto } = require('./ProductoModel');

// Define el modelo CategoriaProducto
class CategoriaProducto extends Model {}

CategoriaProducto.init(
  {
    id_categoria_productos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    nombre_categoria: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: null,
    },
  },
  {
    sequelize, // Se pasa la instancia de Sequelize
    modelName: 'categoria_productos', // Nombre del modelo en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'categoria_productos'
  }
);
// CategoriaProducto.hasMany(Producto, {
//   foreignKey: 'id_categoria_productos',
//   as:  'productos'
// });
// CategoriaProducto.hasMany(Producto, {
//   foreignKey: 'id_categoria_productos',
//   as:  'productos'
// });
// Producto.belongsTo(CategoriaProducto, {
//   foreignKey:'id_categoria_productos_fk',
//   as: 'categoria'
// });
CategoriaProducto.associate = function(models) {
  CategoriaProducto.hasMany(models.Producto, { as: 'productos', foreignKey: 'categoriaId' });
};

module.exports = { CategoriaProducto };
