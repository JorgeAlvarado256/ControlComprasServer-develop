const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const recibirCorreos = require('../utils/receiveEmails'); // Ruta correcta

// Cargar variables de entorno
dotenv.config();

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
const kpiRoutes = require('../routes/kpiRoutes'); // Usa el nombre del archivo que queda

// Directorio para subida de archivos
const uploadDir = path.join(__dirname, 'uploads');

// Configuración de Express
const app = express();

// Middleware de sesión
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
    origin: 'https://control-compras-front-e8fe7.web.app',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use('/api/v1', kpiRoutes);

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

// Ruta para manejar el webhook de Mailgun
app.post('/webhook/mailgun', async (req, res) => {
    try {
        const { recipient, subject, from, 'body-plain': body } = req.body;

        // Procesar el correo electrónico recibido
        const cotizacionId = extractCotizacionIdFromSubject(subject);
        const proveedorEmail = extractProveedorEmail(from);

        // Buscar la cotización en la base de datos
        const cotizacion = await Cotizacion.findByPk(cotizacionId);
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        // Actualizar la cotización con la respuesta del proveedor
        cotizacion.respuesta_proveedor = body;
        await cotizacion.save();

        res.status(200).json({ message: 'Correo procesado y cotización actualizada' });
    } catch (error) {
        console.error('Error al procesar el correo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

const extractCotizacionIdFromSubject = (subject) => {
    // Implementa tu lógica para extraer el ID de cotización del asunto del correo
    return subject.split(' ')[1]; // Ejemplo simple
};

const extractProveedorEmail = (from) => {
    // Implementa tu lógica para extraer el correo del proveedor del campo 'from'
    return from;
};

// Iniciar la recepción de correos en segundo plano
recibirCorreos().catch(error => {
    console.error('Error al iniciar la recepción de correos:', error);
});

module.exports = app;
