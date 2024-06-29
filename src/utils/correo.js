const nodemailer = require('nodemailer');

class Correo {
  constructor() {
    // Configuración del transporte
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tu_correo@gmail.com', // Coloca aquí tu dirección de correo Gmail
        pass: 'tu_contraseña' // Coloca aquí tu contraseña de correo Gmail
      }
    });
  }

  async enviarCorreo(destinatario, asunto, cuerpo) {
    try {
      // Opciones del correo
      const mailOptions = {
        from: 'tu_correo@gmail.com', // Dirección de correo remitente
        to: destinatario, // Dirección de correo destinatario
        subject: asunto, // Asunto del correo
        html: cuerpo // Cuerpo del correo en formato HTML
      };

      // Envío del correo
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.messageId);
      return true; // Correo enviado correctamente
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return false; // Error al enviar el correo
    }
  }
}

module.exports = Correo;
