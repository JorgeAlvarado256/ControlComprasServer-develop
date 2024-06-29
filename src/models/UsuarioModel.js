const { DataTypes, Model } = require('sequelize');
require('dotenv').config();
const sequelize = require('../../config/db.sequelize');
//const {OrdenPedidoCabecera} = require('./OrdenPedidoCabeceraModel');
const {Departamento} = require('./DepartamentoModel');

class Usuario extends Model {} //Objeto debe ser singular en todos los casos

Usuario.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  contraseña: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  nombre_usuario: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  cod_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_departamento: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email_usuario: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
},{
    // Otras opciones de Model
    sequelize, // instancia de bbdd
    modelName: 'usuarios', // Nombre de la tabla en la base de datos
    timestamps: false, // Desactiva la creación automática de campos 'createdAt' y 'updatedAt'
    tableName: 'usuarios'

}
);

// Se definen las relaciones con otras tablas si es necesario
// Usuario.belongsTo(Empresa, { foreignKey: 'rut_empresa' });
// Usuario.belongsTo(Rol, { foreignKey: 'cod_rol' });
// Usuario.belongsTo(Departamento, { foreignKey: 'cod_departamento' });

Departamento.hasMany(Usuario, {
  foreignKey: 'id_departamento',
  as: 'usuario',
});
Usuario.belongsTo(Departamento, {
  foreignKey: 'id_departamento',
  as: 'departamento',
});

module.exports = { Usuario };
