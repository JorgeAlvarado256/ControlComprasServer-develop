const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');


// Define el modelo Rol
class Rol extends Model {}

Rol.init(
  {
    id_roles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    cod_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_rol: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
   
  },
  {
    sequelize, // Se pasa la instancia de Sequelize
    modelName: 'roles', // Nombre del modelo en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'roles'

  }
);

module.exports = { Rol };
