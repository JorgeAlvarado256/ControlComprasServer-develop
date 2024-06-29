const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
const {Usuario} = require('./UsuarioModel');

 

// Define el modelo Departamento
class Departamento extends Model {}

Departamento.init(
  {
    id_departamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    cod_departamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nom_departamento: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
    },
    email_departamento: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
    },
    rut_jefe_departamento: {
      type: DataTypes.STRING(12),
      allowNull: true,
      defaultValue: null,
    },
    cod_estado: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
  },
  {
    sequelize, // Se pasa la instancia de Sequelize
    modelName: 'departamento', // Nombre del modelo en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'departamento'//****Colocar en todos modelos*****
  }
);


module.exports = { Departamento };
