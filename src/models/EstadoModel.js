const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');

class Estado extends Model {}
Estado.init(
    {
        id_estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_estado: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descripcion_estado: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        tipo_estado: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'estado',
        timestamps: false
    }
);

module.exports = { Estado };