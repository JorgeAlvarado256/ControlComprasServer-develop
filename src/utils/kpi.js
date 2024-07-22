const { OrdenPedidoCabecera } = require('../models/OrdenPedidoCabeceraModel');
const sequelize = require('../../config/db.sequelize');

// Lógica para obtener el total de órdenes por solicitante
const totalOrdenesPorSolicitante = async (rut_usuario) => {
    try {
        const count = await OrdenPedidoCabecera.count({
            where: { rut_usuario }
        });
        return count;
    } catch (error) {
        console.error('Error en totalOrdenesPorSolicitante:', error);
        throw error;
    }
};

// Lógica para obtener las órdenes por estado para un solicitante
const ordenesPorEstadoSolicitante = async (rut_usuario, estado_seguimiento) => {
    try {
        const queryOptions = {
            attributes: [
                'estado_seguimiento',
                [sequelize.fn('COUNT', sequelize.col('estado_seguimiento')), 'total']
            ],
            where: { rut_usuario },
            group: ['estado_seguimiento']
        };

        if (estado_seguimiento) {
            // Si se proporciona un estado_seguimiento específico, filtrar también por él
            queryOptions.where.estado_seguimiento = estado_seguimiento;
        }

        const results = await OrdenPedidoCabecera.findAll(queryOptions);
        return results;
    } catch (error) {
        console.error('Error en ordenesPorEstadoSolicitante:', error);
        throw error;
    }
};

// Lógica para obtener el total de órdenes por encargado
const totalOrdenesPorEncargado = async (rut_usuario) => {
    return totalOrdenesPorSolicitante(rut_usuario); // Similar a la lógica del solicitante
};

// Lógica para obtener el total de órdenes recibidas por encargado
const totalOrdenesRecibidasPorEncargado = async (rut_usuario) => {
    try {
        const count = await OrdenPedidoCabecera.count({
            where: {
                rut_usuario,
                estado_seguimiento: 'Recibida' // Ajusta esto al estado correcto si es necesario
            }
        });
        return count;
    } catch (error) {
        console.error('Error en totalOrdenesRecibidasPorEncargado:', error);
        throw error;
    }
};

// Lógica para obtener las órdenes por estado para un encargado
const ordenesPorEstadoEncargado = async (rut_usuario, estado_seguimiento) => {
    return ordenesPorEstadoSolicitante(rut_usuario, estado_seguimiento); // Lógica similar al solicitante
};

// Lógica para obtener el total de órdenes para revisión por la jefatura
const totalOrdenesParaRevisionJefatura = async (rut_usuario) => {
    return totalOrdenesPorSolicitante(rut_usuario); // Similar a la lógica del solicitante
};

// Lógica para obtener las órdenes por estado para la jefatura
const ordenesPorEstadoJefatura = async (rut_usuario, estado_seguimiento) => {
    return ordenesPorEstadoSolicitante(rut_usuario, estado_seguimiento); // Lógica similar al solicitante
};

module.exports = {
    totalOrdenesPorSolicitante,
    ordenesPorEstadoSolicitante,
    totalOrdenesPorEncargado,
    totalOrdenesRecibidasPorEncargado,
    ordenesPorEstadoEncargado,
    totalOrdenesParaRevisionJefatura,
    ordenesPorEstadoJefatura
};
