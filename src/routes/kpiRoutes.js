const express = require('express');
const router = express.Router();
const KPI = require('../utils/kpi');

// Endpoint para obtener KPIs de un usuario solicitante específico
router.get('/kpi/solicitante/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;

    if (!rut_usuario) {
        return res.status(400).json({ error: 'El parámetro rut_usuario es requerido' });
    }

    try {
        const totalOrdenes = await KPI.totalOrdenesPorSolicitante(rut_usuario);
        const ordenesPorEstado = await KPI.ordenesPorEstadoSolicitante(rut_usuario);

        res.json({
            rut_usuario,
            totalOrdenes,
            ordenesPorEstado
        });
    } catch (error) {
        console.error("Error en endpoint /kpi/solicitante/:rut_usuario:", error);
        res.status(500).json({ error: 'Error al obtener KPIs para solicitante' });
    }
});

// Endpoint para obtener KPIs de un usuario encargado específico
router.get('/kpi/encargado/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;

    if (!rut_usuario) {
        return res.status(400).json({ error: 'El parámetro rut_usuario es requerido' });
    }

    try {
        const totalOrdenes = await KPI.totalOrdenesPorEncargado(rut_usuario);
        const totalOrdenesRecibidas = await KPI.totalOrdenesRecibidasPorEncargado(rut_usuario);
        const ordenesPorEstado = await KPI.ordenesPorEstadoEncargado(rut_usuario);

        res.json({
            rut_usuario,
            totalOrdenes,
            totalOrdenesRecibidas,
            ordenesPorEstado
        });
    } catch (error) {
        console.error("Error en endpoint /kpi/encargado/:rut_usuario:", error);
        res.status(500).json({ error: 'Error al obtener KPIs para encargado' });
    }
});

// Endpoint para obtener KPIs para revisión por la jefatura
router.get('/kpi/jefatura/:rut_usuario', async (req, res) => {
    const { rut_usuario } = req.params;

    if (!rut_usuario) {
        return res.status(400).json({ error: 'El parámetro rut_usuario es requerido' });
    }

    try {
        const totalOrdenesParaRevision = await KPI.totalOrdenesParaRevisionJefatura(rut_usuario);
        const ordenesPorEstado = await KPI.ordenesPorEstadoJefatura(rut_usuario);

        res.json({
            rut_usuario,
            totalOrdenesParaRevision,
            ordenesPorEstado
        });
    } catch (error) {
        console.error("Error en endpoint /kpi/jefatura/:rut_usuario:", error);
        res.status(500).json({ error: 'Error al obtener KPIs para jefatura' });
    }
});

// Endpoint para obtener el total de órdenes por estado y rol
router.get('/kpi/ordenes/estado/:rut_usuario/:estado_seguimiento?', async (req, res) => {
    const { rut_usuario, estado_seguimiento } = req.params;

    if (!rut_usuario) {
        return res.status(400).json({ error: 'El parámetro rut_usuario es requerido' });
    }

    try {
        const ordenesPorEstado = await KPI.ordenesPorEstadoSolicitante(rut_usuario, estado_seguimiento);

        res.json({
            rut_usuario,
            estado_seguimiento,
            ordenesPorEstado
        });
    } catch (error) {
        console.error("Error en endpoint /kpi/ordenes/estado/:rut_usuario/:estado_seguimiento:", error);
        res.status(500).json({ error: 'Error al obtener órdenes por estado' });
    }
});

module.exports = router;
