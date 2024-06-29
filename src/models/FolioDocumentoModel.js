const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');

// Define el modelo FolioDocumento
class FolioDocumento extends Model {}
 
FolioDocumento.init(
  {
    id_folios_documentos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rut_empresa: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    tipo_documentos: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    ultimo_folio_usado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize, // Se pasa la instancia de Sequelize
    modelName: 'folios_documentos', // Nombre del modelo en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'folios_documentos'
  }
);

module.exports = { FolioDocumento };
