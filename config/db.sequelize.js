const { Sequelize } = require('sequelize');
// require('dotenv').config();
require('dotenv').config({ path: '/etc/secrets/.env' });

const sequelize = new Sequelize(
    process.env.DB_DATABASE,  // Nombre de la base de datos
    process.env.DB_USER,      // Usuario de la base de datos
    process.env.DB_PASSWORD,  // Contraseña de la base de datos
    {
        host: process.env.DB_HOST,       // Host de la base de datos
        dialect: process.env.DB_DIALECT, // Dialecto de la base de datos (por ejemplo, mysql)
        port: process.env.DB_PORT,       // Puerto de la base de datos
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
