const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB,        // Nombre de la base de datos
    process.env.MYSQL_ADDON_USER,      // Usuario de la base de datos
    process.env.MYSQL_ADDON_PASSWORD,  // Contraseña de la base de datos
    {
        host: process.env.MYSQL_ADDON_HOST,       // Host de la base de datos
        dialect: 'mysql',                        // Dialecto de la base de datos (mysql en este caso)
        port: process.env.MYSQL_ADDON_PORT,       // Puerto de la base de datos
    }
);

// Prueba de conexión
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
