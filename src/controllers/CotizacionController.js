const Cotizacion = require('../models/CotizacionModel');
const DetalleCotizacion = require('../models/DetalleCotizacionModel');
const { Proveedor } = require('../models/ProveedorModel');
const { Producto } = require('../models/ProductoModel');
const { Usuario } = require('../models/UsuarioModel'); // Importa el modelo de Usuario
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sequelize = require('../../config/db.sequelize');



exports.crearCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.create(req.body);
    res.status(201).json(cotizacion);
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.obtenerCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.findAll({
      include: {
        model: DetalleCotizacion,
        include: {
          model: Producto, // Corregimos aquí
          as: 'producto' // Alias para acceder a los datos del producto
        },
        as: 'detalles'
      }
    });
    res.status(200).json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.actualizarCotizacion = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await Cotizacion.update(req.body, {
      where: { id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.status(200).json({ message: 'Cotización actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.eliminarCotizacion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Cotizacion.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.status(200).json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Cotizacion.findAll({
      include: DetalleCotizacion // Esto carga los detalles asociados a cada cotización
    });
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.enviarSolicitudCotizacion = async (req, res) => {
  try {
    const { fecha_emision, estado_seguimiento, detalles } = req.body;

    console.log('Datos recibidos en la solicitud:', req.body);

    // Verificar si se proporcionaron detalles de cotización
    if (!detalles || detalles.length === 0) {
      return res.status(400).json({ message: 'No se han proporcionado detalles de cotización válidos' });
    }

    // Verificar si cada detalle de cotización tiene la información necesaria
    for (const detalle of detalles) {
      if (!detalle.id_producto || !detalle.cantidad_solicitada || !detalle.id_orden_pedido_cabecera_fk) {
        return res.status(400).json({ message: 'Los detalles de cotización deben contener id_producto, cantidad_solicitada y id_orden_pedido_cabecera_fk' });
      }
    }

    // Crear la nueva cotización
    const nuevaCotizacion = await Cotizacion.create({
      fecha_emision,
      estado_seguimiento
    });

    // Crear los detalles de cotización asociados a la nueva cotización
    const detallesCotizacion = detalles.map(detalle => ({
      id_cotizacion_fk: nuevaCotizacion.id_cotizacion,
      id_producto: detalle.id_producto,
      cantidad_solicitada: detalle.cantidad_solicitada,
      cantidad_comprada: detalle.cantidad_comprada || null,
      cantidad_recepcionada: detalle.cantidad_recepcionada || null,
      estado_seguimiento_producto: 'EPP',
      id_orden_pedido_cabecera_fk: detalle.id_orden_pedido_cabecera_fk
    }));

    await DetalleCotizacion.bulkCreate(detallesCotizacion);

    res.status(200).json({ message: 'Solicitud de cotización creada correctamente' });
  } catch (error) {
    console.error('Error al enviar la solicitud de cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor al enviar la solicitud de cotización', error: error.message });
  }
};

exports.obtenerDetallesCotizacion = async (req, res) => {
  try {
    const detalles = await DetalleCotizacion.findAll();
    res.status(200).json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles de cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.obtenerPedidosCotizados = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.findAll();
    const pedidosCotizados = cotizaciones.map(cotizacion => cotizacion.id_orden_pedido_cabecera_fk);
    res.status(200).json(pedidosCotizados);
  } catch (error) {
    console.error('Error al obtener pedidos cotizados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.crearSolicitudProveedorCotizacion = async (req, res) => {
  try {
      // Obtener el correo del usuario logueado (suponiendo que está disponible en req.user.email)
      const remitente = req.user.email_usuario;

      // Obtener el correo del proveedor
      const proveedorId = req.body.id_proveedores; // Suponiendo que el ID del proveedor se envía en la solicitud
      const proveedor = await Proveedor.findOne({ where: { id_proveedores: proveedorId } });
      const destinatario = proveedor.email_proveedor; // Suponiendo que el correo del proveedor está almacenado en el campo 'email_proveedor'

      // Configurar el transporte de nodemailer
      const transporter = nodemailer.createTransport({
          // Aquí debes proporcionar la configuración SMTP correspondiente a tu proveedor de correo
          // Por ejemplo:
          // host: 'smtp.gmail.com',
          // port: 587,
          // secure: false,
          // auth: {
          //     user: 'tucorreo@gmail.com',
          //     pass: 'tucontraseña'
          // }
          // En lugar de proporcionar el correo y contraseña aquí, puedes usar el correo del usuario logueado como remitente
          auth: {
              user: remitente,
              // No necesitas proporcionar la contraseña si estás utilizando la sesión de usuario para la autenticación
          }
      });

      // Opciones del correo electrónico
      const mailOptions = {
          from: remitente, // Correo del usuario logueado
          to: destinatario, // Correo del proveedor
          subject: 'Solicitud de cotización', // Asunto del correo
          text: '¡Hola! Tenemos una solicitud de cotización para ti.', // Cuerpo del correo en texto sin formato
          // Puedes agregar más opciones según tus necesidades, como HTML para contenido HTML, adjuntos, etc.
      };

      // Enviar el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error al enviar el correo electrónico:', error);
              res.status(500).json({ message: 'Error al enviar el correo electrónico' });
          } else {
              console.log('Correo electrónico enviado:', info.response);
              res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
          }
      });
  } catch (error) {
      console.error('Error al crear la solicitud de proveedor de cotización:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.agregarProveedorCotizacion = async (req, res) => {
  try {
    const { id_cotizacion, id_proveedores, rut_usuario } = req.params;

    // Verificar si los parámetros son válidos
    if (!id_proveedores || !id_cotizacion || !rut_usuario) {
      console.error('Parámetros faltantes o inválidos');
      return res.status(400).json({ message: 'Los parámetros son requeridos' });
    }

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({ where: { rut_usuario: rut_usuario } });
    if (!usuario) {
      console.error(`Usuario no encontrado: ${rut_usuario}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene un correo electrónico
    if (!usuario.email_usuario) {
      console.error('Correo electrónico del usuario no encontrado');
      return res.status(404).json({ message: 'Correo electrónico del usuario no encontrado' });
    }

    // Obtener el correo del remitente
    const remitente = usuario.email_usuario;

    // Buscar la cotización y el proveedor en la base de datos
    const cotizacion = await Cotizacion.findByPk(id_cotizacion);
    const proveedor = await Proveedor.findByPk(id_proveedores);
    if (!cotizacion) {
      console.error(`Cotización no encontrada: ${id_cotizacion}`);
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    if (!proveedor) {
      console.error(`Proveedor no encontrado: ${id_proveedores}`);
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    // Obtener el correo del proveedor
    const correoProveedor = proveedor.email_proveedor;
    if (!correoProveedor) {
      console.error(`Correo del proveedor no encontrado para proveedor: ${id_proveedores}`);
      return res.status(404).json({ message: 'Correo del proveedor no encontrado' });
    }

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: remitente, // Asegúrate de que remitente sea el nombre de usuario correcto
        pass: process.env.EMAIL_PASSWORD // Asegúrate de que EMAIL_PASSWORD sea la contraseña correcta
      },
    });
    

    // Opciones del correo electrónico
    const mailOptions = {
      from: remitente,
      to: correoProveedor,
      subject: 'Nueva cotización',
      text: 'Se ha agregado una nueva cotización',
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
        return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
      } else {
        console.log('Correo electrónico enviado:', info.response);

        // Actualizar la cotización para marcar que se ha enviado el correo al proveedor
        cotizacion.correo_enviado = true;
        await cotizacion.save();

        console.log('Cotización actualizada con correo enviado');
        return res.status(200).json({ message: 'Proveedor agregado correctamente a la cotización y correo enviado' });
      }
    });
  } catch (error) {
    console.error('Error al agregar proveedor a la cotización:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.actualizarProveedorCotizacion = async (req, res) => {
  try {
    const { id_cotizacion, id_proveedores, rut_usuario } = req.params;
    const { estadoSeguimiento } = req.body;

    // Verificar si los parámetros son válidos
    if (!id_proveedores || !id_cotizacion || !rut_usuario) {
      console.error('Parámetros faltantes o inválidos');
      return res.status(400).json({ message: 'Los parámetros son requeridos' });
    }

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({ where: { rut_usuario: rut_usuario } });
    if (!usuario) {
      console.error(`Usuario no encontrado: ${rut_usuario}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene un correo electrónico
    if (!usuario.email_usuario) {
      console.error('Correo electrónico del usuario no encontrado');
      return res.status(404).json({ message: 'Correo electrónico del usuario no encontrado' });
    }

    // Obtener el correo del remitente
    const remitente = usuario.email_usuario;

    // Buscar la cotización y el proveedor en la base de datos, incluyendo los detalles de la cotización
    const cotizacion = await Cotizacion.findByPk(id_cotizacion, { include: 'detalles' });
    const proveedor = await Proveedor.findByPk(id_proveedores);
    if (!cotizacion) {
      console.error(`Cotización no encontrada: ${id_cotizacion}`);
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    if (!proveedor) {
      console.error(`Proveedor no encontrado: ${id_proveedores}`);
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    // Obtener el correo del proveedor
    const correoProveedor = proveedor.email_proveedor;
    if (!correoProveedor) {
      console.error(`Correo del proveedor no encontrado para proveedor: ${id_proveedores}`);
      return res.status(404).json({ message: 'Correo del proveedor no encontrado' });
    }

    // Verificar si existen detalles de la cotización
    if (!cotizacion.detalles || cotizacion.detalles.length === 0) {
      console.error(`Detalles de cotización no encontrados para cotización: ${id_cotizacion}`);
      return res.status(404).json({ message: 'Detalles de cotización no encontrados' });
    }

    const htmlContent = `
      <h1>Detalle de Cotización Actualizada</h1>
      <p>ID Cotización: ${cotizacion.id_cotizacion}</p>
      <p>Fecha de Emisión: ${cotizacion.fecha_emision}</p>
      <p>Estado de Seguimiento: ${cotizacion.estado_seguimiento}</p>
      <h2>Detalles</h2>
      <ul>
        ${cotizacion.detalles.map(detalle => `
          <li>
            <p>ID Producto: ${detalle.id_producto}</p>
            <p>Cantidad Solicitada: ${detalle.cantidad_solicitada}</p>
          </li>
        `).join('')}
      </ul>
    `;

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: remitente,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    // Opciones del correo electrónico
    const mailOptions = {
      from: remitente,
      to: correoProveedor,
      subject: 'Actualización de cotización',
      html: htmlContent,
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
        return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
      } else {
        console.log('Correo electrónico enviado:', info.response);

        // Actualizar la cotización con el estado de seguimiento y marcar que se envió el correo
        cotizacion.estado_seguimiento = estadoSeguimiento;
        cotizacion.correo_enviado = true;
        await cotizacion.save();

        console.log('Cotización actualizada con estado de seguimiento y correo enviado');
        return res.status(200).json({ message: 'Proveedor actualizado correctamente en la cotización y correo enviado' });
      }
    });
  } catch (error) {
    console.error('Error al actualizar proveedor en la cotización:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.actualizarPedido = async (req, res) => {
  const { id } = req.params;
  try {
    // Lógica para actualizar el pedido utilizando el idCotizacion
    const pedidoActualizado = await Pedido.update({ nombre_estado: 'EP' }, {
      where: { id_cotizacion: id }
    });

    if (pedidoActualizado) {
      res.status(200).json({ message: 'Pedido actualizado correctamente', data: pedidoActualizado });
    } else {
      res.status(404).json({ message: 'No se encontró el pedido para actualizar' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el pedido', error });
  }
};

exports.actualizarEstadoCotizacion = async (req, res) => {
  const { id_cotizacion } = req.params;
  const { estado_seguimiento } = req.body; // Se espera que el nuevo estado se envíe en el cuerpo de la solicitud
  
  try {
    // Aquí va la lógica para actualizar el estado de la cotización utilizando el ID proporcionado
    
    // Por ejemplo, podrías usar el modelo de Cotizacion para actualizar el estado
    const cotizacion = await Cotizacion.findByPk(id_cotizacion);
    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    
    // Actualizar el estado de la cotización
    cotizacion.estado_seguimiento = estado_seguimiento; // Suponiendo que el campo en la base de datos se llama 'estado_seguimiento'
    await cotizacion.save();
    
    res.status(200).json({ message: 'Estado de cotización actualizado correctamente', data: cotizacion });
  } catch (error) {
    console.error('Error al actualizar el estado de la cotización:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

exports.guardarSolicitudCotizacion = async (req, res) => {
  try {
    const nuevaCotizacion = req.body;
    
    // Verificar si la fecha de emisión se proporciona en la solicitud y si es una fecha válida
    if (!nuevaCotizacion.fecha_emision || isNaN(Date.parse(nuevaCotizacion.fecha_emision))) {
      return res.status(400).json({ error: 'La fecha de emisión es obligatoria y debe ser una fecha válida' });
    }

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
      // Crear la cotización con la fecha de emisión proporcionada dentro de la transacción
      const cotizacion = await Cotizacion.create({
        fecha_emision: nuevaCotizacion.fecha_emision,
        estado_seguimiento: nuevaCotizacion.estado_seguimiento
        // Otros campos de cotización
      }, { transaction });

      // Verificar si se proporcionan detalles para la cotización y se valida su presencia
      if (!nuevaCotizacion.detalles || nuevaCotizacion.detalles.length === 0) {
        throw new Error('Se requieren detalles para la cotización');
      }

      // Crear los detalles de la cotización asociados a la cotización recién creada dentro de la transacción
      const detalles = nuevaCotizacion.detalles.map(detalle => ({
        ...detalle,
        id_cotizacion_fk: cotizacion.id_cotizacion
      }));
      await DetalleCotizacion.bulkCreate(detalles, { transaction });

      // Commit la transacción si todo se ejecuta correctamente
      await transaction.commit();

      // Devolver una respuesta exitosa con los datos de la cotización creada
      return res.status(201).json({ message: 'Cotización guardada con éxito', data: cotizacion });
    } catch (error) {
      // Rollback la transacción si hay algún error
      await transaction.rollback();
      throw error; // Relanzar el error para que sea manejado por el bloque catch externo
    }
  } catch (error) {
    // Manejar otros errores que puedan ocurrir durante el proceso de guardado
    console.error(error); // Registrar el error para depuración
    return res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
  }
};
