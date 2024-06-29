const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');

// Define el modelo RegistroAcceso
class RegistroAcceso extends Model {}

RegistroAcceso.init(
  {
    id_registro_acceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    rut_usuario: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    fecha_hora_conexion: {
      type: DataTypes.date,
      allowNull: true,
      defaultValue: null,
    },
    ip_conexion: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize, // Se pasa la instancia de Sequelize
    modelName: 'registros_accesos', // Nombre del modelo en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'registros_accesos'

  }
);

module.exports = { RegistroAcceso };
