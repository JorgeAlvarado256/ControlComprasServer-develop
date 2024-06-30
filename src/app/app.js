// app.js
require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');

// Rutas
const AuthRouter = require("../routes/AuthRoutes");
const ProductosRouter = require("../routes/ProductosRoutes");
const ProveedorRouter = require("../routes/ProveedorRoutes");
const CategoriaProductoRouter = require("../routes/CategoriaProductoRoutes");
const DepartamentoRouter = require("../routes/DepartamentoRoutes");
const UsuarioRouter = require("../routes/UsuarioRoutes");
const EmpresaRouter = require("../routes/EmpresaRoutes");
const OrdenPedidoDetallesRouter = require("../routes/OrdenPedidoDetalleRoutes");
const OrdenPedidoCabeceraRouter = require("../routes/OrdenPedidoCabeceraRoutes");
const OrdenCompraDetallesRouter = require("../routes/OrdenCompraDetallesRoutes");
const OrdenCompraCabeceraRouter = require("../routes/OrdenCompraCabeceraRoutes");
const EstadoRouter = require("../routes/EstadoRoutes");
const CotizacionRouter = require("../routes/CotizacionRoutes");

const app = express();

// Configuración de Passport
require('../utils/passport-config'); // Asegúrate de que esto apunte al archivo donde configuras Passport

// Configuración de sesión
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:4200', // Cambia esto al origen adecuado de tu frontend
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));
app.options('*', cors()); // Responder a las solicitudes OPTIONS con CORS

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Express for ControlCompras');
});

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Uso de rutas
app.use("/api/v1", AuthRouter);
app.use("/api/v1", ProductosRouter);
app.use("/api/v1", ProveedorRouter);
app.use("/api/v1", CategoriaProductoRouter);
app.use("/api/v1", DepartamentoRouter);
app.use("/api/v1", UsuarioRouter);
app.use("/api/v1", EmpresaRouter);
app.use("/api/v1", OrdenPedidoDetallesRouter);
app.use("/api/v1", OrdenCompraCabeceraRouter);
app.use("/api/v1", OrdenPedidoCabeceraRouter);
app.use("/api/v1", OrdenCompraDetallesRouter);
app.use("/api/v1", EstadoRouter);
app.use("/api/v1", CotizacionRouter);

module.exports = app;
