const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/db.sequelize'); // Asegúrate de importar la instancia de Sequelize adecuada

class Proveedor extends Model {}

Proveedor.init(
  {
    id_proveedores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    rut_proveedor: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    razon_social: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    direccion: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    ciudad: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    nombre_contacto_proveedor: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
    },
    celular_contacto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    email_proveedor: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    giro: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize, // Instancia de Sequelize
    modelName: 'proveedores',
    tableName: 'proveedores', // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
  }
);

module.exports = { Proveedor };
