const Imap = require('node-imap');
const fs = require('fs');
const { promisify } = require('util');
const { Usuario } = require('../models/UsuarioModel');

// Función para descargar archivos adjuntos de un correo
async function descargarArchivosAdjuntos(rut_usuario) {
  try {
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({ where: { rut_usuario: rut_usuario } });
    if (!usuario) {
      console.error(`Usuario no encontrado: ${rut_usuario}`);
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Verificar si el usuario tiene un correo electrónico
    if (!usuario.email_usuario) {
      console.error('Correo electrónico del usuario no encontrado');
      return { success: false, message: 'Correo electrónico del usuario no encontrado' };
    }

    // Obtener el correo del remitente
    const remitente = usuario.email_usuario;

    // Configuración de la conexión IMAP
    const imapConfig = {
      user: remitente,
      password: process.env.EMAIL_PASSWORD,
      host: 'imap.gmail.com', // Cambia esto a la dirección correcta del servidor IMAP
      port: 993,
      tls: true,
    };

    const imap = new Imap(imapConfig);

    const conectar = promisify(imap.connect).bind(imap);
    const abrirBandeja = promisify(imap.openBox).bind(imap);
    const buscarCorreos = promisify(imap.search).bind(imap);
    const obtenerEncabezado = promisify(imap.fetch).bind(imap);

    await conectar();

    await abrirBandeja('INBOX');

    const ids = await buscarCorreos(['UNSEEN'], { bodies: ['HEADER.FIELDS (FROM SUBJECT)'] });

    const promesas = ids.map(async id => {
      const headers = await obtenerEncabezado(id, { struct: true });

      const attachments = (headers.find(header => header.which === 'TEXT').body.attachments || []);

      await Promise.all(attachments.map(async attachment => {
        const fileName = attachment.params.name;
        const filePath = `./uploads/${fileName}`;

        const writeStream = fs.createWriteStream(filePath);

        const stream = await imap.fetch(id, { bodies: [attachment.partID] });
        stream.pipe(writeStream);

        return new Promise((resolve, reject) => {
          writeStream.on('finish', () => {
            console.log(`Archivo ${fileName} guardado en ${filePath}`);
            resolve();
          });
          writeStream.on('error', reject);
        });
      }));
    });

    await Promise.all(promesas);

    imap.end();
    return { success: true, message: 'Archivos adjuntos descargados correctamente' };
  } catch (error) {
    console.error('Error al descargar archivos adjuntos:', error);
    imap.end();
    return { success: false, message: 'Error al descargar archivos adjuntos' };
  }
}

module.exports =  descargarArchivosAdjuntos ;
