const { OrdenPedidoCabecera } = require('../models/OrdenPedidoCabeceraModel');
const { Usuario } = require('../models/UsuarioModel');
const { Op } = require('sequelize'); // Importa Op para consultas avanzadas

// Función auxiliar para obtener el rol del usuario
const obtenerRolUsuario = async (rut_usuario) => {
  if (!rut_usuario) {
    throw new Error('rut_usuario es requerido');
  }
  console.log('Buscando rol para:', rut_usuario); // Añade un log para depuración
  const usuario = await Usuario.findOne({ where: { rut_usuario } });
  if (!usuario) {
    throw new Error(`Usuario con rut_usuario ${rut_usuario} no encontrado`);
  }
  return usuario.cod_rol;
};

// KPIs para solicitantes
exports.obtenerKPIsSolicitante = async (req, res) => {
  try {
    const { rut_usuario } = req.params;
    if (!rut_usuario) {
      return res.status(400).send('El parámetro rut_usuario es requerido');
    }
    console.log('rut_usuario en obtenerKPIsSolicitante:', rut_usuario);

    // Verificar rol del usuario
    const rolUsuario = await obtenerRolUsuario(rut_usuario);
    if (rolUsuario !== 3) {
      return res.status(403).send('Acceso denegado para este rol');
    }

    // Consultar KPIs para solicitante
    const totalPedidosPendientes = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'PENR'
      }
    });

    const totalPedidosAprobados = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'APRO'
      }
    });

    const totalPedidosRechazados = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'RECJ'
      }
    });

    const totalPedidosEnRevision = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'REVJ'
      }
    });

    res.json({
      totalPedidosPendientes,
      totalPedidosAprobados,
      totalPedidosRechazados,
      totalPedidosEnRevision
    });
  } catch (error) {
    console.error('Error al obtener KPIs para solicitante:', error);
    res.status(500).send('Error al obtener KPIs');
  }
};

// KPIs para encargados
exports.obtenerKPIsEncargado = async (req, res) => {
  try {
    const { rut_usuario } = req.params;
    if (!rut_usuario) {
      return res.status(400).send('El parámetro rut_usuario es requerido');
    }
    console.log('rut_usuario en obtenerKPIsEncargado:', rut_usuario);

    // Verificar rol del usuario
    const rolUsuario = await obtenerRolUsuario(rut_usuario);
    if (rolUsuario !== 7) {
      return res.status(403).send('Acceso denegado para este rol');
    }

    // Pedidos pendientes de revisión por el encargado
    const totalPedidosPendientes = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'PENRC'
      }
    });

    // Pedidos aprobados por el encargado
    const totalPedidosAprobados = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'APRO'
      }
    });

    // Pedidos rechazados por el encargado
    const totalPedidosRechazados = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'RECJ'
      }
    });

    // Pedidos en revisión por el encargado
    const totalPedidosEnRevision = await OrdenPedidoCabecera.count({
      where: {
        rut_usuario: rut_usuario,
        estado_seguimiento: 'REVJ'
      }
    });

    // Pedidos recibidos de los solicitantes (con rol 3)
    const totalPedidosRecibidosPendientes = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'PENR',
        rut_usuario: {
          [Op.not]: rut_usuario // Excluye los pedidos del propio encargado
        }
      }
    });

    const totalPedidosRecibidosAprobados = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'APRO',
        rut_usuario: {
          [Op.not]: rut_usuario // Excluye los pedidos del propio encargado
        }
      }
    });

    const totalPedidosRecibidosRechazados = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'RECJ',
        rut_usuario: {
          [Op.not]: rut_usuario // Excluye los pedidos del propio encargado
        }
      }
    });

    const totalPedidosRecibidosEnRevision = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'REVJ',
        rut_usuario: {
          [Op.not]: rut_usuario // Excluye los pedidos del propio encargado
        }
      }
    });

    res.json({
      totalPedidosPendientes,
      totalPedidosAprobados,
      totalPedidosRechazados,
      totalPedidosEnRevision,
      totalPedidosRecibidosPendientes,
      totalPedidosRecibidosAprobados,
      totalPedidosRecibidosRechazados,
      totalPedidosRecibidosEnRevision
    });
  } catch (error) {
    console.error('Error al obtener KPIs para encargado:', error);
    res.status(500).send('Error al obtener KPIs');
  }
};

// KPIs para jefatura
exports.obtenerKPIsJefatura = async (req, res) => {
  try {
    const { rut_usuario } = req.params;
    if (!rut_usuario) {
      return res.status(400).send('El parámetro rut_usuario es requerido');
    }
    console.log('rut_usuario en obtenerKPIsJefatura:', rut_usuario);

    // Verificar rol del usuario
    const rolJefatura = await obtenerRolUsuario(rut_usuario);
    if (rolJefatura !== 4) {
      return res.status(403).send('Acceso denegado para este rol');
    }

    // Pedidos en revisión por la jefatura (revisión de pedidos de encargados)
    const totalPedidosEnRevision = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'PENRC'
      }
    });

    // Pedidos recibidos por la jefatura (pedido aprobados y rechazados de los encargados)
    const totalPedidosRecibidosPendientes = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'PENRC'
      }
    });

    const totalPedidosRecibidosAprobados = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'APRO'
      }
    });

    const totalPedidosRecibidosRechazados = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'RECJ'
      }
    });

    const totalPedidosRecibidosEnRevision = await OrdenPedidoCabecera.count({
      where: {
        estado_seguimiento: 'REVJ'
      }
    });

    res.json({
      totalPedidosEnRevision,
      totalPedidosRecibidosPendientes,
      totalPedidosRecibidosAprobados,
      totalPedidosRecibidosRechazados,
      totalPedidosRecibidosEnRevision
    });
  } catch (error) {
    console.error('Error al obtener KPIs para jefatura:', error);
    res.status(500).send('Error al obtener KPIs');
  }
};
