// Require de módulos y configuración inicial
// require('dotenv').config();
require('dotenv').config({ path: '/etc/secrets/.env' });
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const { descargarArchivosAdjuntos } = require('../utils/imap');


// Rutas importadas
const AuthRouter = require('../routes/AuthRoutes');
const ProductosRouter = require('../routes/ProductosRoutes');
const ProveedorRouter = require('../routes/ProveedorRoutes');
const CategoriaProductoRouter = require('../routes/CategoriaProductoRoutes');
const DepartamentoRouter = require('../routes/DepartamentoRoutes');
const UsuarioRouter = require('../routes/UsuarioRoutes');
const EmpresaRouter = require('../routes/EmpresaRoutes');
const OrdenPedidoDetallesRouter = require('../routes/OrdenPedidoDetalleRoutes');
const OrdenPedidoCabeceraRouter = require('../routes/OrdenPedidoCabeceraRoutes');
const OrdenCompraDetallesRouter = require('../routes/OrdenCompraDetallesRoutes');
const OrdenCompraCabeceraRouter = require('../routes/OrdenCompraCabeceraRoutes');
const EstadoRouter = require('../routes/EstadoRoutes');
const CotizacionRouter = require('../routes/CotizacionRoutes');
// const imapRouter = require('../utils/imap');

// Directorio para subida de archivos
const uploadDir = path.join(__dirname, 'uploads');

// Configuración de Express
const app = express();

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
const corsOptions = {
    origin: 'http://localhost:4200', // Cambia esto al origen adecuado de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permite incluir cookies en las solicitudes (necesario si usas sesiones con Passport)
};

app.use(cors(corsOptions));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Express for ControlCompras');
});

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Uso de rutas
app.use('/api/v1', AuthRouter);
app.use('/api/v1', ProductosRouter);
app.use('/api/v1', ProveedorRouter);
app.use('/api/v1', CategoriaProductoRouter);
app.use('/api/v1', DepartamentoRouter);
app.use('/api/v1', UsuarioRouter);
app.use('/api/v1', EmpresaRouter);
app.use('/api/v1', OrdenPedidoDetallesRouter);
app.use('/api/v1', OrdenCompraCabeceraRouter);
app.use('/api/v1', OrdenPedidoCabeceraRouter);
app.use('/api/v1', OrdenCompraDetallesRouter);
app.use('/api/v1', EstadoRouter);
app.use('/api/v1', CotizacionRouter);
// app.use('/api/v1',imapRouter );

// Configuración de Multer para la carga de archivos PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Puedes personalizar el nombre del archivo si lo deseas
    }
});

const upload = multer({ storage: storage });

// Ruta para manejar la carga de archivos PDF
app.post('/upload-pdf', upload.single('pdf'), function (req, res) {
    res.send('Archivo PDF recibido y guardado.');
});

// Middleware para servir archivos estáticos (PDFs)
app.use('/pdfs', express.static(uploadDir));

// Middleware para manejar errores CORS
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    } else {
        next();
    }
});

// module.exports = { descargarArchivosAdjuntos };


module.exports = app;
