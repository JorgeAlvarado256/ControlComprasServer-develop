const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
//const {OrdenPedidoCabecera} = require('./OrdenPedidoCabeceraModel');
const {Departamento} = require('./DepartamentoModel');

// Define el modelo Empresa
class Empresa extends Model {}

Empresa.init(
  {
    id_empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    razon_social: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    contacto: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    telefono_empresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    email_empresa: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize, // Se pasa la instancia de Sequelize
    modelName: 'empresa', // Nombre del modelo en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'empresa'
  }
);

Empresa.hasMany(Departamento, {
  foreignKey: 'rut_empresa',
  as: 'departamento',
});
Departamento.belongsTo(Empresa, {
  foreignKey: 'rut_empresa',
  targetKey: 'rut_empresa',
  as: 'empresa',
});

module.exports = { Empresa };
